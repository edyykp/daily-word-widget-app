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
        if (intent.action == AppWidgetManager.ACTION_APPWIDGET_UPDATE) {
            val appWidgetManager = AppWidgetManager.getInstance(context)
            val componentName = ComponentName(context, DailyWordWidgetProvider::class.java)
            val appWidgetIds = appWidgetManager.getAppWidgetIds(componentName)
            onUpdate(context, appWidgetManager, appWidgetIds)
        }
    }

    companion object {
        fun updateAppWidget(
            context: Context,
            appWidgetManager: AppWidgetManager,
            appWidgetId: Int
        ) {
            val prefs: SharedPreferences =
                context.getSharedPreferences("DailyWordWidget", Context.MODE_PRIVATE)

            val word = prefs.getString("word", "Loading...") ?: "Loading..."
            val definition = prefs.getString("definition", "Fetching word...") ?: "Fetching word..."

            val views = RemoteViews(context.packageName, R.layout.daily_word_widget)

            views.setTextViewText(R.id.widget_word, word)
            views.setTextViewText(R.id.widget_definition, definition)
            // Show an emoji accent if saved, otherwise a default sparkle
            val emoji = prefs.getString("favoriteEmoji", "✨") ?: "✨"
            try {
                views.setTextViewText(R.id.widget_emoji, emoji)
            } catch (e: Exception) {
                // Some remoteviews/layout combos may not support emoji; ignore safely
            }

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
