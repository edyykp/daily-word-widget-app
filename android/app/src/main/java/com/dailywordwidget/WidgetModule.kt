package com.dailywordwidget

import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.content.Context
import android.content.SharedPreferences
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableMap

class WidgetModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "WidgetModule"
    }

    @ReactMethod
    fun updateWidget(data: ReadableMap, promise: Promise) {
        try {
            val context = reactApplicationContext.applicationContext
            val prefs: SharedPreferences =
                context.getSharedPreferences("DailyWordWidget", Context.MODE_PRIVATE)
            val editor = prefs.edit()

            editor.putString("word", data.getString("word") ?: "")
            editor.putString("definition", data.getString("definition") ?: "")
            editor.putString("phonetic", data.getString("phonetic") ?: "")
            editor.putString("partOfSpeech", data.getString("partOfSpeech") ?: "")
            editor.putString("example", data.getString("example") ?: "")
            editor.putString("date", data.getString("date") ?: "")
            editor.putString("language", data.getString("language") ?: "en")
            editor.apply()

            // Update the widget
            val widgetManager = AppWidgetManager.getInstance(context)
            val widgetIds = widgetManager.getAppWidgetIds(
                ComponentName(context, DailyWordWidgetProvider::class.java)
            )
            if (widgetIds.isNotEmpty()) {
                DailyWordWidgetProvider.updateAppWidget(
                    context,
                    widgetManager,
                    widgetIds[0]
                )
            }

            promise.resolve(null)
        } catch (e: Exception) {
            promise.reject("UPDATE_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun reloadWidget(promise: Promise) {
        // Android doesn't need explicit reload like iOS
        promise.resolve(null)
    }

    @ReactMethod
    fun getIsPlaying(promise: Promise) {
        try {
            val context = reactApplicationContext.applicationContext
            val prefs: SharedPreferences = context.getSharedPreferences("DailyWordWidget", Context.MODE_PRIVATE)
            val isPlaying = prefs.getBoolean("isPlaying", false)
            promise.resolve(isPlaying)
        } catch (e: Exception) {
            promise.reject("GET_PLAYING_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun stopPhonetic(promise: Promise) {
        try {
            val context = reactApplicationContext.applicationContext
            val prefs: SharedPreferences = context.getSharedPreferences("DailyWordWidget", Context.MODE_PRIVATE)
            prefs.edit().putBoolean("isPlaying", false).apply()

            try {
                DailyWordWidgetProvider.activeTts?.stop()
                DailyWordWidgetProvider.activeTts?.shutdown()
                DailyWordWidgetProvider.activeTts = null
            } catch (e: Exception) {
                // ignore
            }

            val widgetManager = AppWidgetManager.getInstance(context)
            val widgetIds = widgetManager.getAppWidgetIds(
                ComponentName(context, DailyWordWidgetProvider::class.java)
            )
            if (widgetIds.isNotEmpty()) {
                DailyWordWidgetProvider.updateAppWidget(
                    context,
                    widgetManager,
                    widgetIds[0]
                )
            }

            promise.resolve(null)
        } catch (e: Exception) {
            promise.reject("STOP_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun playPhonetic(phonetic: String, promise: Promise) {
        try {
            val context = reactApplicationContext.applicationContext
            val prefs: SharedPreferences = context.getSharedPreferences("DailyWordWidget", Context.MODE_PRIVATE)
            prefs.edit().putBoolean("isPlaying", true).apply()

            // Update widgets
            val widgetManager = AppWidgetManager.getInstance(context)
            val widgetIds = widgetManager.getAppWidgetIds(
                ComponentName(context, DailyWordWidgetProvider::class.java)
            )
            if (widgetIds.isNotEmpty()) {
                DailyWordWidgetProvider.updateAppWidget(
                    context,
                    widgetManager,
                    widgetIds[0]
                )
            }

            var tts: android.speech.tts.TextToSpeech? = null
            tts = android.speech.tts.TextToSpeech(context) { status ->
                DailyWordWidgetProvider.activeTts = tts
                if (status == android.speech.tts.TextToSpeech.SUCCESS) {
                    tts?.language = java.util.Locale.getDefault()
                    val params = android.os.Bundle()
                    params.putString(android.speech.tts.TextToSpeech.Engine.KEY_PARAM_UTTERANCE_ID, "playPhonetic")
                    tts?.setOnUtteranceProgressListener(object: android.speech.tts.UtteranceProgressListener() {
                        override fun onStart(utteranceId: String) {}
                        override fun onDone(utteranceId: String) {
                            try {
                                prefs.edit().putBoolean("isPlaying", false).apply()
                                val widgetManagerFinish = AppWidgetManager.getInstance(context)
                                val widgetIdsFinish = widgetManagerFinish.getAppWidgetIds(ComponentName(context, DailyWordWidgetProvider::class.java))
                                if (widgetIdsFinish.isNotEmpty()) {
                                    DailyWordWidgetProvider.updateAppWidget(context, widgetManagerFinish, widgetIdsFinish[0])
                                }
                                tts?.shutdown()
                                DailyWordWidgetProvider.activeTts = null
                                promise.resolve(null)
                            } catch (e: Exception) {
                                promise.reject("TTS_DONE_ERROR", e.message, e)
                            }
                        }
                        override fun onError(utteranceId: String) {
                            try {
                                prefs.edit().putBoolean("isPlaying", false).apply()
                                val widgetManagerFinish = AppWidgetManager.getInstance(context)
                                val widgetIdsFinish = widgetManagerFinish.getAppWidgetIds(ComponentName(context, DailyWordWidgetProvider::class.java))
                                if (widgetIdsFinish.isNotEmpty()) {
                                    DailyWordWidgetProvider.updateAppWidget(context, widgetManagerFinish, widgetIdsFinish[0])
                                }
                                tts?.shutdown()
                                DailyWordWidgetProvider.activeTts = null
                                promise.reject("TTS_ERROR", "Error during utterance")
                            } catch (e: Exception) {
                                promise.reject("TTS_ERROR2", e.message, e)
                            }
                        }
                    })
                    tts?.speak(phonetic, android.speech.tts.TextToSpeech.QUEUE_FLUSH, params, "playPhonetic")
                } else {
                    prefs.edit().putBoolean("isPlaying", false).apply()
                    promise.reject("TTS_INIT_ERROR", "TTS init failed with status $status")
                }
            }
        } catch (e: Exception) {
            promise.reject("TTS_ERROR", e.message, e)
        }
    }
}
