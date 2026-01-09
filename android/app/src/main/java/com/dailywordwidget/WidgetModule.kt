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
}
