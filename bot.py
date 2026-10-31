"""
Bozorchi AI Telegram Bot Companion
Allows opening the Bozorchi AI Telegram Mini App directly from Telegram.

Setup:
1. Create a bot in @BotFather, get BOT_TOKEN
2. Run `pip install python-telegram-bot python-dotenv`
3. Set your deployed Mini App URL in .env or BOT_WEBAPP_URL
4. Run `python bot.py`
"""
import os
import logging
from dotenv import load_dotenv
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
from telegram.ext import Application, CommandHandler, ContextTypes

load_dotenv()
logging.basicConfig(level=logging.INFO)

BOT_TOKEN = os.getenv("BOT_TOKEN", "YOUR_BOT_TOKEN_HERE")
WEBAPP_URL = os.getenv("WEBAPP_URL", "https://bozorchi-ai.vercel.app")

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_name = update.effective_user.first_name if update.effective_user else "Baqqol"
    keyboard = [
        [
            InlineKeyboardButton(
                "🛒 Bozorchi AI Mini App-ni ochish",
                web_app=WebAppInfo(url=WEBAPP_URL)
            )
        ],
        [
            InlineKeyboardButton(
                "👥 Chilonzor-9 Guruh Xaridi (Pool)",
                web_app=WebAppInfo(url=f"{WEBAPP_URL}")
            )
        ]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)

    await update.message.reply_text(
        f"Assalomu alaykum, {user_name}!\n\n"
        f"**Bozorchi AI** — Toshkentdagi baqqollik do'konlari uchun ulgurji narxlar taxtasi "
        f"va birgalikda xarid (pooling) platformasiga xush kelibsiz.\n\n"
        f"📊 Bozor narxlarini solishtiring (O'rikzor, Food City, Chorsu)\n"
        f"👥 Chilonzor-9 klasterida qo'shnilaringiz bilan arzon narxga birlashing\n"
        f"📷 Fakturani BozorVision AI orqali skanerlang va BozorCoin oling\n\n"
        f"Ilovani ishga tushirish uchun quyidagi tugmani bosing 👇",
        reply_markup=reply_markup,
        parse_mode="Markdown"
    )

def main():
    if BOT_TOKEN == "YOUR_BOT_TOKEN_HERE":
        print("[!] Eslatma: .env faylida BOT_TOKEN ni ko'rsating. Aks holda bot ishga tushmaydi.")
        return

    app = Application.builder().token(BOT_TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    print(f"[*] Bozorchi AI bot ishga tushdi... WebApp URL: {WEBAPP_URL}")
    app.run_polling()

if __name__ == "__main__":
    main()
