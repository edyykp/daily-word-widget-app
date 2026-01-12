package com.dailywordwidget

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.widget.RemoteViews

class DailyWordWidgetProvider : AppWidgetProvider() {

    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        for (appWidgetId in appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId)
        }
    }

    override fun onReceive(context: Context, intent: Intent) {
        super.onReceive(context, intent)
        when (intent.action) {
            AppWidgetManager.ACTION_APPWIDGET_UPDATE -> {
                val appWidgetManager = AppWidgetManager.getInstance(context)
                val componentName = ComponentName(context, DailyWordWidgetProvider::class.java)
                val appWidgetIds = appWidgetManager.getAppWidgetIds(componentName)
                onUpdate(context, appWidgetManager, appWidgetIds)
            }
            PLAY_ACTION -> {
                // Play phonetic via Android TTS
                android.util.Log.d("DailyWordWidget", "PLAY_ACTION received")
                try {
                    val prefs: SharedPreferences = context.getSharedPreferences("DailyWordWidget", Context.MODE_PRIVATE)
                    val phonetic = prefs.getString("phonetic", "") ?: ""
                    val wordToSpeakFallback = prefs.getString("word", "") ?: ""
                    val textToSpeak = if (phonetic.isNotEmpty()) phonetic else wordToSpeakFallback
                    android.util.Log.d("DailyWordWidget", "textToSpeak: $textToSpeak")
                    if (textToSpeak.isNotEmpty()) {
                        // mark playing in prefs
                        prefs.edit().putBoolean("isPlaying", true).apply()
                        // update widgets to show pause
                        val appWidgetManager = AppWidgetManager.getInstance(context)
                        val componentName = ComponentName(context, DailyWordWidgetProvider::class.java)
                        val appWidgetIds = appWidgetManager.getAppWidgetIds(componentName)
                        if (appWidgetIds.isNotEmpty()) {
                            for (id in appWidgetIds) {
                                updateAppWidget(context, appWidgetManager, id)
                            }
                        }

                        var tts: android.speech.tts.TextToSpeech? = null
                        tts = android.speech.tts.TextToSpeech(context) { status ->
                            Companion.activeTts = tts
                            android.util.Log.d("DailyWordWidget", "TTS init status: $status")
                            if (status == android.speech.tts.TextToSpeech.SUCCESS) {
                                // Try to set locale based on saved language if available
                                val langCode = prefs.getString("language", "") ?: ""
                                if (langCode.isNotEmpty()) {
                                    try {
                                        val locale = java.util.Locale(langCode)
                                        tts?.language = locale
                                    } catch (e: Exception) {
                                        android.util.Log.d("DailyWordWidget", "Invalid locale $langCode, using default")
                                        tts?.language = java.util.Locale.getDefault()
                                    }
                                } else {
                                    tts?.language = java.util.Locale.getDefault()
                                }

                                val params = android.os.Bundle()
                                params.putString(android.speech.tts.TextToSpeech.Engine.KEY_PARAM_UTTERANCE_ID, "widgetSpeak")
                                android.util.Log.d("DailyWordWidget", "Calling tts.speak for: $textToSpeak")
                                try {
                                    android.widget.Toast.makeText(context, "Playing: $textToSpeak", android.widget.Toast.LENGTH_SHORT).show()
                                } catch (e: Exception) {
                                    // ignore Toast errors in non-UI contexts
                                }
                                tts?.setOnUtteranceProgressListener(object: android.speech.tts.UtteranceProgressListener() {
                                    override fun onStart(utteranceId: String) {
                                        android.util.Log.d("DailyWordWidget", "Utterance onStart")
                                    }
                                    override fun onDone(utteranceId: String) {
                                        android.util.Log.d("DailyWordWidget", "Utterance onDone")
                                        try {
                                            prefs.edit().putBoolean("isPlaying", false).apply()
                                            val appWidgetManagerFinish = AppWidgetManager.getInstance(context)
                                            val componentNameFinish = ComponentName(context, DailyWordWidgetProvider::class.java)
                                            val appWidgetIdsFinish = appWidgetManagerFinish.getAppWidgetIds(componentNameFinish)
                                            if (appWidgetIdsFinish.isNotEmpty()) {
                                                for (idFinish in appWidgetIdsFinish) {
                                                    updateAppWidget(context, appWidgetManagerFinish, idFinish)
                                                }
                                            }
                                            tts?.shutdown()
                                            Companion.activeTts = null
                                        } catch (e: Exception) {
                                            android.util.Log.e("DailyWordWidget", "Error on utterance done: ${'$'}e")
                                        }
                                    }
                                    override fun onError(utteranceId: String) {
                                        android.util.Log.d("DailyWordWidget", "Utterance onError")
                                        try {
                                            prefs.edit().putBoolean("isPlaying", false).apply()
                                            val appWidgetManagerFinish = AppWidgetManager.getInstance(context)
                                            val componentNameFinish = ComponentName(context, DailyWordWidgetProvider::class.java)
                                            val appWidgetIdsFinish = appWidgetManagerFinish.getAppWidgetIds(componentNameFinish)
                                            if (appWidgetIdsFinish.isNotEmpty()) {
                                                for (idFinish in appWidgetIdsFinish) {
                                                    updateAppWidget(context, appWidgetManagerFinish, idFinish)
                                                }
                                            }
                                            tts?.shutdown()
                                            Companion.activeTts = null
                                        } catch (e: Exception) {
                                            android.util.Log.e("DailyWordWidget", "Error on utterance error: ${'$'}e")
                                        }
                                    }
                                })
                                tts?.speak(textToSpeak, android.speech.tts.TextToSpeech.QUEUE_FLUSH, params, "widgetSpeak")
                            } else {
                                android.util.Log.d("DailyWordWidget", "TTS init failed with status: $status")
                                prefs.edit().putBoolean("isPlaying", false).apply()
                            }
                        }
                    } else {
                        android.util.Log.d("DailyWordWidget", "No text available to play")
                    }
                } catch (e: Exception) {
                    android.util.Log.e("DailyWordWidget", "Exception in PLAY_ACTION: ${'$'}e")
                }
            }
            PAUSE_ACTION -> {
                // Stop playback immediately
                android.util.Log.d("DailyWordWidget", "PAUSE_ACTION received")
                try {
                    val prefs: SharedPreferences = context.getSharedPreferences("DailyWordWidget", Context.MODE_PRIVATE)
                    prefs.edit().putBoolean("isPlaying", false).apply()

                    // Stop and shutdown active TTS if present
                    try {
                        activeTts?.stop()
                        activeTts?.shutdown()
                        activeTts = null
                    } catch (e: Exception) {
                        android.util.Log.e("DailyWordWidget", "Error stopping TTS on PAUSE: ${'$'}e")
                    }

                    // update widgets to show play button
                    val appWidgetManager = AppWidgetManager.getInstance(context)
                    val componentName = ComponentName(context, DailyWordWidgetProvider::class.java)
                    val appWidgetIds = appWidgetManager.getAppWidgetIds(componentName)
                    if (appWidgetIds.isNotEmpty()) {
                        for (id in appWidgetIds) {
                            updateAppWidget(context, appWidgetManager, id)
                        }
                    }

                    try {
                        android.widget.Toast.makeText(context, "Stopped", android.widget.Toast.LENGTH_SHORT).show()
                    } catch (e: Exception) {
                        // ignore
                    }
                } catch (e: Exception) {
                    android.util.Log.e("DailyWordWidget", "Exception in PAUSE_ACTION: ${'$'}e")
                }
            }
        }
    }

    companion object {
        const val PLAY_ACTION = "com.dailywordwidget.PLAY_PHONETIC"
        const val PAUSE_ACTION = "com.dailywordwidget.PAUSE_PHONETIC"

        // Keep a reference to the active TTS instance so PAUSE action can stop it
        var activeTts: android.speech.tts.TextToSpeech? = null

        fun updateAppWidget(
            context: Context,
            appWidgetManager: AppWidgetManager,
            appWidgetId: Int
        ) {
            val prefs: SharedPreferences =
                context.getSharedPreferences("DailyWordWidget", Context.MODE_PRIVATE)

            val word = prefs.getString("word", "Loading...") ?: "Loading..."
            val definition = prefs.getString("definition", "Fetching word...") ?: "Fetching word..."
            val phonetic = prefs.getString("phonetic", "") ?: ""
            val language = prefs.getString("language", "en") ?: "en"

            val views = RemoteViews(context.packageName, R.layout.daily_word_widget)

            views.setTextViewText(R.id.widget_word, word)
            views.setTextViewText(R.id.widget_definition, definition)
            views.setTextViewText(R.id.widget_phonetic, phonetic)
            views.setTextViewText(R.id.widget_language, language.uppercase())
            views.setTextViewText(R.id.widget_phonetic, phonetic)

            // Determine play/pause state and configure button accordingly
            val isPlaying = prefs.getBoolean("isPlaying", false)
            if (isPlaying) {
                views.setImageViewResource(R.id.widget_play, android.R.drawable.ic_media_pause)
            } else {
                views.setImageViewResource(R.id.widget_play, android.R.drawable.ic_media_play)
            }

            val playIntent = Intent(context, DailyWordWidgetProvider::class.java).apply {
                action = if (isPlaying) PAUSE_ACTION else PLAY_ACTION
            }
            val playPending = PendingIntent.getBroadcast(
                context,
                0,
                playIntent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
            views.setOnClickPendingIntent(R.id.widget_play, playPending)

            // Remove emoji support — we show a language badge instead
            // (previously used favoriteEmoji)

            // Optional: Add click intent to open the app
            val intent = Intent(context, MainActivity::class.java)
            val pendingIntent = PendingIntent.getActivity(
                context,
                0,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
            views.setOnClickPendingIntent(R.id.widget_container, pendingIntent)

            appWidgetManager.updateAppWidget(appWidgetId, views)
        }
    }
}
