# Digital Detox Hub

Digital Detox Hub is a simple and effective web application designed to help users reduce screen time, build healthier digital habits, and track their detox progress. It includes daily check-ins, mood tracking, rewards, supportive messages, and overall progress insights.

This project was built as part of a college assignment to demonstrate frontend development, state management, UI design, and user-focused wellbeing features.

---

## 📌 Features

### 📝 1. Create Detox Plan
Users can create a customized detox plan with:
- Plan title  
- Duration (Today only / 7 Days)  
- Focus areas (Instagram, YouTube, Gaming, etc.)  
- Custom focus areas  
- Replacement activities  
- Screen-free time blocks  

Plan data is saved in **localStorage**.

---

### 📅 2. Daily Check-In (Today Page)
- Mark completed screen-free time blocks  
- Mark whether you completed a replacement activity  
- Select your mood (Good / Okay / Stressful / Overwhelmed)  
- View mood-based supportive messages  
- Everything is auto-saved in localStorage  

---

### 📊 3. Progress Page
- Total days  
- Completed days  
- Current streak  
- Progress percentage  
- Daily status breakdown (Completed / Partial / Missed)

---

### 🏆 4. Rewards & Badges
- Daily completion badges  
- 3-day / 5-day / 7-day streak badges  
- Full-plan completion badge  
- Earned vs Locked badges display  

---

### 💙 5. Support Page
Includes:
- Mood-based supportive reminder  
- Breathing exercise  
- Journaling prompt  
- Grounding technique  
- Extra wellbeing messages  

---

## 🛠️ Tech Stack
- React + TypeScript  
- Vite  
- React Router  
- Tailwind CSS  
- Lucide Icons  
- localStorage for persistence  
- Modular utility architecture  

---

## 🧱 Project Structure

```text
src/
  components/        
  pages/             
  types/
    detox.ts         
  utils/
    storage.ts       
    dates.ts         
    plan.ts          
    today.ts         
    progress.ts      
    rewards.ts       
    support.ts       

---

## 🚀 **Running the Project**

# 1. Clone the repository
git clone https://github.com/Sathwikreddy018/Digital-detox-hub.git
cd Digital-detox-hub

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open the app in browser
http://localhost:5173/



## 🧠 **How It Works Internally**

• The detox plan is saved as a DetoxPlan object in localStorage.  
• Daily logs store completed blocks, activities, and mood.  
• Progress and streaks are calculated based on date range + logs.  
• Rewards are computed using completion count and streak logic.  
• Support messages adapt dynamically to today’s mood.  



## 🎓 **Use Case (College Project)**

• UI/UX design  
• Component-based architecture  
• Routing with React Router  
• State persistence using localStorage  
• Utility-driven architecture  
• A complete functioning wellbeing tool  



## 🔮 **Future Enhancements (Optional)**

• Login + cloud sync  
• Push notifications  
• Exportable reports  
• Analytics dashboard  
