"""
Bozorchi AI — Telegram Bot & Mini App Companion
Toshkent ulgurji bozorlari axboroti, profil boshqaruvi, xabarnomalar va birgalikda xarid platformasi.

Xususiyatlari:
1. 🛒 Mini App-ni bevosita ochish
2. 👤 Profil boshqaruvi (Do'kon / Ta'minotchi, BozorCoins, tejamkorlik)
3. 🔔 Xabarnomalar markazi (Narx tushishi, eskrou holati, flash chegirmalar)
4. 📈 Bugungi ulgurji narxlar (O'rikzor, Food City, Chorsu)
5. 👥 Chilonzor-9 Guruh xaridi (Pool)
6. ⚡ 25t Shakar Flash Aksiya
7. 🔄 Rolni almashtirish (Do'kondor <-> Ta'minotchi)
8. 💬 Bozorchi AI aqlli maslahatchisi
"""

import os
import logging
from typing import Dict, Any
from dotenv import load_dotenv
import httpx

from telegram import (
    Update,
    InlineKeyboardButton,
    InlineKeyboardMarkup,
    ReplyKeyboardMarkup,
    KeyboardButton,
    WebAppInfo,
)
from telegram.ext import (
    Application,
    CommandHandler,
    CallbackQueryHandler,
    MessageHandler,
    ContextTypes,
    filters,
)

# Load environment variables
load_dotenv()

logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    level=logging.INFO
)
logger = logging.getLogger("BozorchiAIBot")

BOT_TOKEN = os.getenv("BOT_TOKEN", "YOUR_BOT_TOKEN_HERE")
WEBAPP_URL = os.getenv("WEBAPP_URL", "https://bozorchi-ai.vercel.app")
AI_KEY = os.getenv("VITE_OPENAI_API_KEY") or os.getenv("OPENAI_API_KEY")

# In-memory user database
USERS_DB: Dict[int, Dict[str, Any]] = {}

def get_profile(user_id: int, first_name: str = "Do'kondor") -> Dict[str, Any]:
    if user_id not in USERS_DB:
        USERS_DB[user_id] = {
            "name": first_name or "Do'kondor",
            "role": "shop_owner",  # 'shop_owner' or 'supplier'
            "business_name": f"{first_name} Do'koni" if first_name else "Baraka Market",
            "location": "Chilonzor 9-mavze",
            "phone": "+998 90 123 45 67",
            "lang": "uz",
            "bozor_coins": 12500,
            "total_saved": 1840000,
            "joined_pools": 5,
            "verified": True,
            "notifications": {
                "price_alerts": True,
                "pool_updates": True,
                "flash_deals": True,
            }
        }
    return USERS_DB[user_id]

def get_reply_keyboard(lang: str = "uz") -> ReplyKeyboardMarkup:
    if lang == "ru":
        keyboard = [
            [KeyboardButton("🛒 Открыть Mini App (Bozorchi AI)", web_app=WebAppInfo(url=WEBAPP_URL))],
            [KeyboardButton("📈 Оптовые цены"), KeyboardButton("👥 Пул закупок (Чиланзар-9)")],
            [KeyboardButton("👤 Профиль"), KeyboardButton("🔔 Уведомления")],
            [KeyboardButton("⚡ Флеш-скидка (25т)"), KeyboardButton("🔄 Сменить роль")],
        ]
    elif lang == "en":
        keyboard = [
            [KeyboardButton("🛒 Open Mini App (Bozorchi AI)", web_app=WebAppInfo(url=WEBAPP_URL))],
            [KeyboardButton("📈 Wholesale Prices"), KeyboardButton("👥 Group Pool (Chilonzor-9)")],
            [KeyboardButton("👤 Profile"), KeyboardButton("🔔 Notifications")],
            [KeyboardButton("⚡ Flash Deal (25t)"), KeyboardButton("🔄 Switch Role")],
        ]
    else:
        keyboard = [
            [KeyboardButton("🛒 Mini App-ni ochish (Bozorchi AI)", web_app=WebAppInfo(url=WEBAPP_URL))],
            [KeyboardButton("📈 Ulgurji Narxlar"), KeyboardButton("👥 Guruh Xaridi (Chilonzor-9)")],
            [KeyboardButton("👤 Profil"), KeyboardButton("🔔 Xabarnomalar")],
            [KeyboardButton("⚡ Flash Aksiya (25t)"), KeyboardButton("🔄 Rolni almashtirish")],
        ]
    return ReplyKeyboardMarkup(keyboard, resize_keyboard=True)

def format_profile_text(profile: Dict[str, Any], lang: str = "uz") -> str:
    is_shop = profile["role"] == "shop_owner"
    role_label = (
        ("Do'kon egasi (Baqqollik)" if is_shop else "Ulgurji Ta'minotchi (Distribyutor)")
        if lang == "uz" else
        ("Владелец магазина (Розница)" if is_shop else "Оптовый поставщик (Дистрибьютор)")
        if lang == "ru" else
        ("Shop Owner (Retail Grocery)" if is_shop else "Wholesale Supplier (Distributor)")
    )
    
    notif_active = "Faol (3 ta kanal)" if any(profile["notifications"].values()) else "Ochirilgan"

    if lang == "ru":
        return (
            f"👤 *Профиль в Bozorchi AI:*\n\n"
            f"• *Имя:* {profile['name']}\n"
            f"• *Роль:* {role_label}\n"
            f"• *Магазин / Фирма:* {profile['business_name']}\n"
            f"• *Адрес / Рынок:* {profile['location']}\n"
            f"• *Телефон:* `{profile['phone']}`\n"
            f"• *Статус:* {'✅ Верифицирован (Verified)' if profile['verified'] else '⏳ На проверке'}\n\n"
            f"🪙 *BozorCoins:* {profile['bozor_coins']:,} баллов\n"
            f"💰 *Общая экономия:* {profile['total_saved']:,} сум\n"
            f"📦 *Участие в пулах:* {profile['joined_pools']} завершенных заказов\n\n"
            f"🔔 *Уведомления:* "
            f"{'Активны (3 канала)' if any(profile['notifications'].values()) else 'Выключены'}\n"
            f"🌐 *Язык:* {profile['lang'].upper()}"
        )
    elif lang == "en":
        return (
            f"👤 *Bozorchi AI Profile:*\n\n"
            f"• *Name:* {profile['name']}\n"
            f"• *Role:* {role_label}\n"
            f"• *Business / Store:* {profile['business_name']}\n"
            f"• *Location / Bazaar:* {profile['location']}\n"
            f"• *Phone:* `{profile['phone']}`\n"
            f"• *Status:* {'✅ Verified' if profile['verified'] else '⏳ Pending'}\n\n"
            f"🪙 *BozorCoins:* {profile['bozor_coins']:,} pts\n"
            f"💰 *Total Savings:* {profile['total_saved']:,} UZS\n"
            f"📦 *Joined Pools:* {profile['joined_pools']} completed deals\n\n"
            f"🔔 *Notifications:* "
            f"{'Active (3 channels)' if any(profile['notifications'].values()) else 'Muted'}\n"
            f"🌐 *Language:* {profile['lang'].upper()}"
        )
    else:
        return (
            f"👤 *Bozorchi AI Foydalanuvchi Profili:*\n\n"
            f"• *Ism:* {profile['name']}\n"
            f"• *Rol:* {role_label}\n"
            f"• *Do'kon / Firma:* {profile['business_name']}\n"
            f"• *Manzil / Bozor:* {profile['location']}\n"
            f"• *Telefon:* `{profile['phone']}`\n"
            f"• *Holat:* {'✅ Tasdiqlangan (Verified)' if profile['verified'] else '⏳ Kutilmoqda'}\n\n"
            f"🪙 *BozorCoins:* {profile['bozor_coins']:,} ball\n"
            f"💰 *Jami tejamkorlik:* {profile['total_saved']:,} UZS\n"
            f"📦 *Guruh xaridlari:* {profile['joined_pools']} ta muvaffaqiyatli xarid\n\n"
            f"🔔 *Bildirishnomalar:* {notif_active}\n"
            f"🌐 *Ilova tili:* {profile['lang'].upper()}"
        )

def get_profile_keyboard(lang: str = "uz") -> InlineKeyboardMarkup:
    if lang == "ru":
        buttons = [
            [InlineKeyboardButton("🔄 Сменить роль (Магазин ↔ Поставщик)", callback_data="toggle_role")],
            [InlineKeyboardButton("🔔 Настроить уведомления", callback_data="menu_notify")],
            [InlineKeyboardButton("🌐 Сменить язык (UZ / RU / EN)", callback_data="menu_lang")],
            [InlineKeyboardButton("🛒 Открыть Mini App", web_app=WebAppInfo(url=WEBAPP_URL))]
        ]
    elif lang == "en":
        buttons = [
            [InlineKeyboardButton("🔄 Switch Role (Shop ↔ Supplier)", callback_data="toggle_role")],
            [InlineKeyboardButton("🔔 Manage Notifications", callback_data="menu_notify")],
            [InlineKeyboardButton("🌐 Change Language (UZ / RU / EN)", callback_data="menu_lang")],
            [InlineKeyboardButton("🛒 Open Mini App", web_app=WebAppInfo(url=WEBAPP_URL))]
        ]
    else:
        buttons = [
            [InlineKeyboardButton("🔄 Rolni almashtirish (Do'kondor ↔ Ta'minotchi)", callback_data="toggle_role")],
            [InlineKeyboardButton("🔔 Xabarnomalarni sozlash", callback_data="menu_notify")],
            [InlineKeyboardButton("🌐 Tilni o'zgartirish (UZ / RU / EN)", callback_data="menu_lang")],
            [InlineKeyboardButton("🛒 Mini App-ni ochish", web_app=WebAppInfo(url=WEBAPP_URL))]
        ]
    return InlineKeyboardMarkup(buttons)

def format_notifications_text(profile: Dict[str, Any], lang: str = "uz") -> str:
    n = profile["notifications"]
    p_status = "✅ Faol" if n.get("price_alerts", True) else "❌ O'chirilgan"
    pool_status = "✅ Faol" if n.get("pool_updates", True) else "❌ O'chirilgan"
    flash_status = "✅ Faol" if n.get("flash_deals", True) else "❌ O'chirilgan"

    if lang == "ru":
        p_status = "✅ Вкл" if n.get("price_alerts", True) else "❌ Выкл"
        pool_status = "✅ Вкл" if n.get("pool_updates", True) else "❌ Выкл"
        flash_status = "✅ Вкл" if n.get("flash_deals", True) else "❌ Выкл"
        return (
            f"🔔 *Центр уведомлений Bozorchi AI:*\n\n"
            f"Оповещения приходят напрямую в этот Telegram-чат:\n\n"
            f"1️⃣ *Падение цен на базарах:* {p_status}\n"
            f"   _Когда сахар падает ниже 11 500 сум на Урикзоре_\n\n"
            f"2️⃣ *Статус пулов и доставка:* {pool_status}\n"
            f"   _Эскроу подтвержден, Labo Санжарбека выехал в Чиланзар-9_\n\n"
            f"3️⃣ *Срочные 2-часовые Флеш-скидки:* {flash_status}\n"
            f"   _Поставщик выставил 25т сахара по 11 400 сум_\n\n"
            f"👇 _Используйте кнопки ниже для переключения или отправки тестового уведомления:_"
        )
    elif lang == "en":
        p_status = "✅ On" if n.get("price_alerts", True) else "❌ Off"
        pool_status = "✅ On" if n.get("pool_updates", True) else "❌ Off"
        flash_status = "✅ On" if n.get("flash_deals", True) else "❌ Off"
        return (
            f"🔔 *Bozorchi AI Notification Center:*\n\n"
            f"Real-time alerts sent straight to this Telegram chat:\n\n"
            f"1️⃣ *Wholesale Price Drops:* {p_status}\n"
            f"   _e.g. Sugar drops below 11,500 UZS at O'rikzor_\n\n"
            f"2️⃣ *Pool & Dispatch Status:* {pool_status}\n"
            f"   _e.g. Escrow verified, Labo van departs warehouse_\n\n"
            f"3️⃣ *2-Hour Flash Discounts:* {flash_status}\n"
            f"   _e.g. Supplier broadcasts 25 tons sugar at 11,400 UZS_\n\n"
            f"👇 _Toggle channels or trigger a live test alert below:_"
        )
    else:
        return (
            f"🔔 *Bozorchi AI Xabarnomalar Markazi:*\n\n"
            f"Tezkor xabarlar to'g'ridan-to'g'ri Telegram chatingizga yuboriladi:\n\n"
            f"1️⃣ *Bozor narxlari tushishi:* {p_status}\n"
            f"   _Masalan: Shakar O'rikzorda 11 500 UZS dan arzonlashganda_\n\n"
            f"2️⃣ *Guruh xaridi & Yetkazish:* {pool_status}\n"
            f"   _Masalan: Eskrou tasdiqlandi, Labo mashinasi yo'lga chiqdi_\n\n"
            f"3️⃣ *Tezkor 2 soatlik Flash aksiyalar:* {flash_status}\n"
            f"   _Masalan: Elyor Aka 25t shakar uchun 11 400 UZS e'lon qilganda_\n\n"
            f"👇 _Quyidagi tugmalar orqali kanallarni boshqaring yoki namunaviy xabarnomani tekshiring:_"
        )

def get_notifications_keyboard(profile: Dict[str, Any], lang: str = "uz") -> InlineKeyboardMarkup:
    n = profile["notifications"]
    p_text = f"1. Narx tushishi: {'✅' if n.get('price_alerts') else '❌'}"
    pool_text = f"2. Guruh va Eskrou: {'✅' if n.get('pool_updates') else '❌'}"
    flash_text = f"3. Flash Aksiyalar: {'✅' if n.get('flash_deals') else '❌'}"

    if lang == "ru":
        p_text = f"1. Падение цен: {'✅' if n.get('price_alerts') else '❌'}"
        pool_text = f"2. Пулы и доставка: {'✅' if n.get('pool_updates') else '❌'}"
        flash_text = f"3. Флеш-скидки: {'✅' if n.get('flash_deals') else '❌'}"
        sample_btn = "📢 Отправить тестовые уведомления"
        back_btn = "⬅️ Назад в профиль"
    elif lang == "en":
        p_text = f"1. Price Drops: {'✅' if n.get('price_alerts') else '❌'}"
        pool_text = f"2. Pool & Escrow: {'✅' if n.get('pool_updates') else '❌'}"
        flash_text = f"3. Flash Deals: {'✅' if n.get('flash_deals') else '❌'}"
        sample_btn = "📢 Send Test Notifications"
        back_btn = "⬅️ Back to Profile"
    else:
        sample_btn = "📢 Namuna xabarnomalarni yuborish"
        back_btn = "⬅️ Profilga qaytish"

    buttons = [
        [InlineKeyboardButton(p_text, callback_data="toggle_notify_price")],
        [InlineKeyboardButton(pool_text, callback_data="toggle_notify_pool")],
        [InlineKeyboardButton(flash_text, callback_data="toggle_notify_flash")],
        [InlineKeyboardButton(sample_btn, callback_data="send_sample_alert")],
        [InlineKeyboardButton(back_btn, callback_data="menu_profile")]
    ]
    return InlineKeyboardMarkup(buttons)

# ----------------- AI ASSISTANT INTEGRATION -----------------
async def ask_bozorchi_ai(prompt: str, lang: str = "uz") -> str:
    """Answers queries using AI engine with domain knowledge of Tashkent wholesale markets."""
    if AI_KEY and AI_KEY.startswith("sk-"):
        try:
            system_prompt = (
                "You are Bozorchi AI — an expert wholesale market advisor for grocery stores in Tashkent, Uzbekistan. "
                "You have full knowledge of wholesale prices at O'rikzor, Food City, and Chorsu bazaars: "
                "Sugar: 11,400-11,800 UZS/kg, Flour 1st grade: 255,000 UZS/50kg, Cooking oil 5L: 71,500 UZS, Rice: 14,200 UZS/kg. "
                "You know about the Chilonzor-9 neighborhood group purchasing pool saving 11.7% (1,840,000 UZS) and 15h 45m "
                "with shared Labo van delivery (75,000 UZS/shop). "
                "You know Elyor Aka (Verified Supplier, O'rikzor Block 4) has 25 tons sugar arriving tomorrow with a 2-hour flash discount at 11,400 UZS. "
                "Respond helpfully, politely and concisely in the user's language (default Uzbek, or Russian/English)."
            )
            async with httpx.AsyncClient(timeout=14.0) as client:
                res = await client.post(
                    "https://api.openai.com/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {AI_KEY}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": "gpt-4o-mini",
                        "messages": [
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": prompt}
                        ],
                        "temperature": 0.5,
                        "max_tokens": 450
                    }
                )
                if res.status_code == 200:
                    data = res.json()
                    return data["choices"][0]["message"]["content"].strip()
        except Exception as e:
            logger.warning(f"Live AI call error: {e}. Falling back to domain rules.")

    # Smart local domain fallback
    q = prompt.lower()
    if any(w in q for w in ["shakar", "сахар", "sugar"]):
        return (
            "🌾 *Shakar bo'yicha Bozorchi AI tahlili:*\n\n"
            "• *O'rikzor:* 11 800 UZS (Yakka xarid)\n"
            "• *Chilonzor-9 Guruhi:* 11 400 UZS (-11% chegirma)\n"
            "• *Food City:* 12 400 UZS | *Chorsu:* 12 100 UZS\n\n"
            "📊 Oxirgi 7 kunda narx 3.2% ga tushdi. Ertaga ertalab O'rikzor 4-bazaga 25 tonna yangi partiya kelmoqda, "
            "shuning uchun Chilonzor-9 guruhi bilan xarid qilish eng maqbul vaqt!"
        )
    elif any(w in q for w in ["un", "мука", "flour"]):
        return (
            "🌾 *Un 1-nav (Qozoq 50 kg) tahlili:*\n\n"
            "• *O'rikzor:* 255 000 UZS / qop\n"
            "• *Chorsu:* 260 000 UZS / qop\n"
            "• *Adolatli narx koridori:* 250 000 - 265 000 UZS\n\n"
            "💡 Guruh xaridida 15 qop olinganda Labo transporti 5 do'konga bo'linadi (har bir do'konga 75 000 UZS)."
        )
    elif any(w in q for w in ["guruh", "chilonzor", "pul", "pool", "пул"]):
        return (
            "👥 *Chilonzor-9 Guruh Xaridi (Pool):*\n\n"
            "• 5 ta mahalla do'koni to'liq birlashgan\n"
            "• Jami summa: 13 890 000 UZS (Bozorchi AI xavfsiz eskrouida)\n"
            "• Har bir do'kon o'rtacha 1 840 000 UZS (-11.7%) va 15 soat 45 daqiqa vaqt tejaydi\n"
            "• 1 ta Labo mashinasi (Sanjarbek) barcha 5 do'konga to'g'ridan-to'g'ri yetkazib beradi."
        )
    else:
        return (
            "🤖 *Bozorchi AI Maslahatchisi:*\n\n"
            "Toshkent ulgurji bozorlarida (O'rikzor, Food City, Chorsu) bugun narxlar barqaror koridorda. "
            "Kichik baqqollik do'konlari uchun yakka bozorga borish o'rniga, mahalliy klaster bilan "
            "birgalikda xarid (pooling) qilish har bir buyurtmada o'rtacha 11.7% tejash imkonini beradi.\n\n"
            "Batafsil tahlil va grafiklar uchun quyidagi tugma orqali Mini App-ni oching 👇"
        )

# ----------------- COMMAND HANDLERS -----------------
async def start_cmd(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    profile = get_profile(user.id, user.first_name if user else "Do'kondor")
    lang = profile["lang"]

    text = (
        f"Assalomu alaykum, *{profile['name']}*! 👋\n\n"
        f"**Bozorchi AI** — Toshkent ulgurji narxlar axboroti, profil va guruh xaridi (pooling) platformasiga xush kelibsiz.\n\n"
        f"📊 *Bozor narxlari:* O'rikzor, Food City, Chorsu ulgurji narxlari\n"
        f"👥 *Chilonzor-9 Guruhi:* Qo'shni do'konlar bilan birlashib 11.7% tejang\n"
        f"🔔 *Xabarnomalar:* Narx tushishi va yetkazish haqida Telegramda tezkor bildirish\n"
        f"👤 *Profil:* Balans, BozorCoins, tejamkorlik va rolni almashtirish\n\n"
        f"Quyidagi menyudan kerakli bo'limni tanlang 👇"
    )

    inline_kb = [
        [InlineKeyboardButton("🛒 Bozorchi AI Mini App-ni ochish", web_app=WebAppInfo(url=WEBAPP_URL))],
        [
            InlineKeyboardButton("👤 Profil", callback_data="menu_profile"),
            InlineKeyboardButton("🔔 Xabarnomalar", callback_data="menu_notify")
        ],
        [
            InlineKeyboardButton("📈 Narxlar", callback_data="menu_prices"),
            InlineKeyboardButton("👥 Guruh Xaridi", callback_data="menu_pool")
        ]
    ]

    await update.message.reply_text(
        text,
        reply_markup=get_reply_keyboard(lang),
        parse_mode="Markdown"
    )
    await update.message.reply_text(
        "Tezkor amallar:",
        reply_markup=InlineKeyboardMarkup(inline_kb)
    )

async def profile_cmd(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    profile = get_profile(user.id, user.first_name if user else "Do'kondor")
    lang = profile["lang"]

    text = format_profile_text(profile, lang)
    keyboard = get_profile_keyboard(lang)

    await update.message.reply_text(text, reply_markup=keyboard, parse_mode="Markdown")

async def notifications_cmd(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    profile = get_profile(user.id, user.first_name if user else "Do'kondor")
    lang = profile["lang"]

    text = format_notifications_text(profile, lang)
    keyboard = get_notifications_keyboard(profile, lang)

    await update.message.reply_text(text, reply_markup=keyboard, parse_mode="Markdown")

async def role_cmd(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    profile = get_profile(user.id, user.first_name if user else "Do'kondor")
    
    # Toggle role
    profile["role"] = "supplier" if profile["role"] == "shop_owner" else "shop_owner"
    lang = profile["lang"]

    new_role_title = "Ta'minotchi (Ulgurji baza)" if profile["role"] == "supplier" else "Do'kon egasi (Baqqollik)"
    await update.message.reply_text(
        f"🔄 *Rol muvaffaqiyatli o'zgartirildi!*\n\nSizning yangi rolingiz: *{new_role_title}*\n\n"
        f"Mini App va bot xabarlari endi yangi rolingizga moslashdi.",
        reply_markup=get_reply_keyboard(lang),
        parse_mode="Markdown"
    )

async def prices_cmd(update: Update, context: ContextTypes.DEFAULT_TYPE):
    text = (
        "📈 *Toshkent Ulgurji Bozorlari Narxlari (Bugun 07:00):*\n\n"
        "1️⃣ *Shakar oq (Rossiya/Xorazm):*\n"
        "   • O'rikzor: 11 800 UZS (Guruh bilan: *11 400 UZS*)\n"
        "   • Food City: 12 400 UZS | Chorsu: 12 100 UZS\n"
        "   • Adolatli koridor: 11 300 - 12 600 UZS (-3.2%)\n\n"
        "2️⃣ *Un 1-nav (Qozoq 50 kg):*\n"
        "   • O'rikzor: 255 000 UZS | Chorsu: 260 000 UZS\n"
        "   • Adolatli koridor: 250 000 - 265 000 UZS (Barqaror)\n\n"
        "3️⃣ *Pista yog'i (5L tozalangan):*\n"
        "   • O'rikzor: 71 500 UZS | Food City: 73 000 UZS\n"
        "   • Adolatli koridor: 70 000 - 75 000 UZS\n\n"
        "4️⃣ *Guruch Alanga:* O'rikzor 14 200 UZS\n"
        "5️⃣ *Tuxum C-1 (30 dona):* O'rikzor 33 000 UZS\n\n"
        "💡 _Chilonzor-9 klasterida birlashib xarid qilganda umumiy 11.7% tejaladi!_"
    )
    kb = [
        [InlineKeyboardButton("🛒 Narxlar taxtasini Mini App-da ko'rish", web_app=WebAppInfo(url=WEBAPP_URL))]
    ]
    await update.message.reply_text(text, reply_markup=InlineKeyboardMarkup(kb), parse_mode="Markdown")

async def pool_cmd(update: Update, context: ContextTypes.DEFAULT_TYPE):
    text = (
        "👥 *Chilonzor-9 Guruh Xaridi (Active Pool):*\n\n"
        "⏱ *Holat:* 5/5 do'kon to'liq birlashdi! (Tayyor)\n"
        "💰 *Jami to'lov:* 13 890 000 UZS (Eskrouda kafolatlangan)\n"
        "📉 *Tejamkorlik:* 1 840 000 UZS (-11.7%)\n"
        "⏳ *Vaqt tejaldi:* 15 soat 45 daqiqa\n"
        "🚚 *Yetkazish:* 1 ta umumiy Labo (Sanjarbek, 75 000 UZS/do'kon)\n\n"
        "*Yuk tarkibi:*\n"
        "• Shakar: 500 kg (11 400 UZS)\n"
        "• Un 1-nav: 15 qop (255 000 UZS)\n"
        "• Pista yog'i: 60 dona (71 500 UZS)\n\n"
        "*Birlashgan do'konlar:* Siz (Baraka), Farhod, Navro'z, Oqtepa, Nurziyo"
    )
    kb = [
        [InlineKeyboardButton("🛒 Guruh xaridini Mini App-da ochish", web_app=WebAppInfo(url=WEBAPP_URL))]
    ]
    await update.message.reply_text(text, reply_markup=InlineKeyboardMarkup(kb), parse_mode="Markdown")

async def flash_cmd(update: Update, context: ContextTypes.DEFAULT_TYPE):
    text = (
        "⚡ *Tezkor 2-Soatlik Flash Chegirma:*\n\n"
        "👤 *Ta'minotchi:* Elyor Aka (O'rikzor 4-blok, Verified ★)\n"
        "📦 *Mahsulot:* Shakar oq (Rossiya) — 25 tonna yuk\n"
        "🏷 *Aksiya narxi:* 11 400 UZS/kg (Odatdagi: 12 800 UZS)\n"
        "⏱ *Qolgan vaqt:* 01:58:30\n"
        "🎯 *Mo'ljallangan:* Chilonzor va Uchtepa klasteridagi 48 do'kon\n\n"
        "🚚 _Eskrou to'lovi tasdiqlangach, Sanjarbek (Labo) darhol yetkazib beradi!_"
    )
    kb = [
        [InlineKeyboardButton("🛒 Aksiya bilan buyurtma berish", web_app=WebAppInfo(url=WEBAPP_URL))]
    ]
    await update.message.reply_text(text, reply_markup=InlineKeyboardMarkup(kb), parse_mode="Markdown")

async def lang_cmd(update: Update, context: ContextTypes.DEFAULT_TYPE):
    buttons = [
        [
            InlineKeyboardButton("O'zbekcha 🇺🇿", callback_data="set_lang_uz"),
            InlineKeyboardButton("Русский 🇷🇺", callback_data="set_lang_ru"),
            InlineKeyboardButton("English 🇬🇧", callback_data="set_lang_en"),
        ]
    ]
    await update.message.reply_text(
        "Ilova va bot tilini tanlang / Выберите язык / Select language:",
        reply_markup=InlineKeyboardMarkup(buttons)
    )

# ----------------- CALLBACK QUERY ROUTER -----------------
async def callback_router(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()

    user = query.from_user
    profile = get_profile(user.id, user.first_name if user else "Do'kondor")
    data = query.data
    lang = profile["lang"]

    if data == "menu_profile":
        text = format_profile_text(profile, lang)
        keyboard = get_profile_keyboard(lang)
        await query.edit_message_text(text, reply_markup=keyboard, parse_mode="Markdown")

    elif data == "menu_notify":
        text = format_notifications_text(profile, lang)
        keyboard = get_notifications_keyboard(profile, lang)
        await query.edit_message_text(text, reply_markup=keyboard, parse_mode="Markdown")

    elif data == "toggle_notify_price":
        profile["notifications"]["price_alerts"] = not profile["notifications"].get("price_alerts", True)
        text = format_notifications_text(profile, lang)
        keyboard = get_notifications_keyboard(profile, lang)
        await query.edit_message_text(text, reply_markup=keyboard, parse_mode="Markdown")

    elif data == "toggle_notify_pool":
        profile["notifications"]["pool_updates"] = not profile["notifications"].get("pool_updates", True)
        text = format_notifications_text(profile, lang)
        keyboard = get_notifications_keyboard(profile, lang)
        await query.edit_message_text(text, reply_markup=keyboard, parse_mode="Markdown")

    elif data == "toggle_notify_flash":
        profile["notifications"]["flash_deals"] = not profile["notifications"].get("flash_deals", True)
        text = format_notifications_text(profile, lang)
        keyboard = get_notifications_keyboard(profile, lang)
        await query.edit_message_text(text, reply_markup=keyboard, parse_mode="Markdown")

    elif data == "toggle_role":
        profile["role"] = "supplier" if profile["role"] == "shop_owner" else "shop_owner"
        text = format_profile_text(profile, lang)
        keyboard = get_profile_keyboard(lang)
        await query.edit_message_text(
            f"🔄 *Rol muvaffaqiyatli almashtirildi!*\n\n{text}",
            reply_markup=keyboard,
            parse_mode="Markdown"
        )

    elif data == "menu_lang":
        buttons = [
            [
                InlineKeyboardButton("O'zbekcha 🇺🇿", callback_data="set_lang_uz"),
                InlineKeyboardButton("Русский 🇷🇺", callback_data="set_lang_ru"),
                InlineKeyboardButton("English 🇬🇧", callback_data="set_lang_en"),
            ],
            [InlineKeyboardButton("⬅️ Ortga / Назад", callback_data="menu_profile")]
        ]
        await query.edit_message_text(
            "Tilni tanlang / Выберите язык / Select language:",
            reply_markup=InlineKeyboardMarkup(buttons)
        )

    elif data.startswith("set_lang_"):
        new_lang = data.replace("set_lang_", "")
        profile["lang"] = new_lang
        text = format_profile_text(profile, new_lang)
        keyboard = get_profile_keyboard(new_lang)
        await query.edit_message_text(
            f"✅ Til o'zgartirildi: *{new_lang.upper()}*\n\n{text}",
            reply_markup=keyboard,
            parse_mode="Markdown"
        )

    elif data == "send_sample_alert":
        # Send 3 realistic sample push notifications straight into chat
        await query.message.reply_text(
            "🚨 *NARX TUSHDI! (Bozorchi AI Xabarnomasi)*\n\n"
            "📍 *Bozor:* O'rikzor 4-baza (Elyor Aka)\n"
            "🌾 *Mahsulot:* Shakar oq (Rossiya)\n"
            "📉 *Yangi narx:* 11 400 UZS/kg (-1 400 UZS)\n"
            "🎯 *Siz o'rnatgan chegara:* 11 500 UZS\n\n"
            "💡 _Tavsiya: Do'koningiz uchun haftalik zaxirani hozir xarid qilish eng maqbul vaqt!_",
            parse_mode="Markdown"
        )
        await query.message.reply_text(
            "⚡ *YANGI FLASH AKSIYA (2 Soatlik)*\n\n"
            "👤 *Ta'minotchi:* Elyor Aka (O'rikzor 4-blok, Verified ★)\n"
            "📦 *Mahsulot:* 25 tonna shakar oq (Rossiya)\n"
            "🏷 *Aksiya narxi:* 11 400 UZS/kg (Odatdagi: 12 800 UZS)\n"
            "⏱ *Qolgan vaqt:* 01:59:12\n"
            "🎯 *Klaster:* Chilonzor va Uchtepa do'konlari (48 ta do'kon)\n\n"
            "🛒 _Mini App-da xarid guruhiga qo'shiling!_",
            parse_mode="Markdown"
        )
        await query.message.reply_text(
            "🚚 *LABO MASHINASI YO'LGA CHIQDI!*\n\n"
            "📦 *Klaster:* Chilonzor-9 guruhi (5 do'kon)\n"
            "💰 *Eskrou to'lovi:* 13 890 000 UZS tasdiqlangan ✓\n"
            "🚚 *Mashina:* Labo (01 723 A), Sanjarbek\n"
            "⏱ *Taxminiy yetib borish:* 25 daqiqa (11:45)\n\n"
            "📷 _Yuk yetib kelgach fakturani BozorVision AI da skanerlang va 2 500 BozorCoin oling!_",
            parse_mode="Markdown"
        )

    elif data == "menu_prices":
        await prices_cmd(update, context)

    elif data == "menu_pool":
        await pool_cmd(update, context)

# ----------------- MESSAGE HANDLER -----------------
async def text_message_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    text = (update.message.text or "").strip()
    user = update.effective_user
    profile = get_profile(user.id, user.first_name if user else "Do'kondor")
    lang = profile["lang"]

    # Match reply keyboard buttons
    t_lower = text.lower()
    if "profil" in t_lower or "профиль" in t_lower or "profile" in t_lower:
        await profile_cmd(update, context)
        return
    elif "xabarnoma" in t_lower or "уведомлен" in t_lower or "notification" in t_lower:
        await notifications_cmd(update, context)
        return
    elif "narx" in t_lower or "цены" in t_lower or "price" in t_lower:
        await prices_cmd(update, context)
        return
    elif "guruh" in t_lower or "пул" in t_lower or "pool" in t_lower:
        await pool_cmd(update, context)
        return
    elif "flash" in t_lower or "флеш" in t_lower or "aksiya" in t_lower or "акци" in t_lower:
        await flash_cmd(update, context)
        return
    elif "rol" in t_lower or "роль" in t_lower or "role" in t_lower:
        await role_cmd(update, context)
        return

    # If free question, delegate to Bozorchi AI Assistant
    await update.message.reply_chat_action("typing")
    ai_reply = await ask_bozorchi_ai(text, lang)
    await update.message.reply_text(ai_reply, parse_mode="Markdown")

# ----------------- MAIN RUNNER -----------------
def main():
    if not BOT_TOKEN or BOT_TOKEN == "YOUR_BOT_TOKEN_HERE":
        print("[!] Eslatma: .env faylida BOT_TOKEN ni to'g'ri ko'rsating.")
        return

    app = Application.builder().token(BOT_TOKEN).build()

    # Commands
    app.add_handler(CommandHandler("start", start_cmd))
    app.add_handler(CommandHandler("profile", profile_cmd))
    app.add_handler(CommandHandler("notifications", notifications_cmd))
    app.add_handler(CommandHandler("notify", notifications_cmd))
    app.add_handler(CommandHandler("role", role_cmd))
    app.add_handler(CommandHandler("prices", prices_cmd))
    app.add_handler(CommandHandler("pool", pool_cmd))
    app.add_handler(CommandHandler("flash", flash_cmd))
    app.add_handler(CommandHandler("lang", lang_cmd))

    # Callbacks & Text messages
    app.add_handler(CallbackQueryHandler(callback_router))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, text_message_handler))

    print(f"[*] Bozorchi AI Bot ishga tushdi! WebApp URL: {WEBAPP_URL}")
    app.run_polling()

if __name__ == "__main__":
    main()
