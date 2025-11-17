# Digital Detox Hub

Digital Detox Hub is a simple and effective web application designed to help users reduce screen time, build healthier digital habits, and track their detox progress. It includes daily check-ins, mood tracking, rewards, supportive messages, and overall progress insights.

This project was built as part of a college assignment to demonstrate frontend development, state management, UI design, and user-focused wellbeing features.

---

## 📌 Features

### 📝 1. Create Detox Plan
Users can create a customized detox plan with:
- Plan title  
- Duration (Today only / 7 Days)  
- Focus areas (e.g., Instagram, YouTube, Gaming, etc.)  
- Custom focus areas  
- Replacement activities  
- Screen-free time blocks (Morning, Night, or custom blocks)  

All plan data is saved directly in the browser using **localStorage**.

---

### 📅 2. Daily Check-In (Today Page)

The Today page helps users stay on track:

- Mark completed screen-free time blocks  
- Check if they did at least one replacement activity  
- Select how they feel today (Good / Okay / Stressful / Overwhelmed)  
- View a mood-based supportive message  
- Everything is saved instantly in localStorage

Daily logs are stored as `DailyLog` objects.

---

### 📊 3. Progress Page

Shows overall progress across the detox period:

- Total days in the plan  
- Days successfully completed  
- Current streak  
- Progress percentage  
- A day-by-day visual breakdown (Completed / Partial / Missed)

Progress is calculated using timestamps and stored logs.

---

### 🏆 4. Rewards & Badges

A simple gamified reward system includes:

- Daily completion badges  
- Streak badges (3-day, 5-day, 7-day streaks)  
- Milestone badges (Full plan completion)  
- Badges displayed as **earned** or **locked**  

Reward data is stored in localStorage as `RewardData`.

---

### 💙 5. Support Page (Emotional Support)

A dedicated page for guidance and mental wellbeing:

- Mood-aware supportive message  
- 1-minute breathing exercise  
- Journaling prompt  
- Grounding exercise (5-4-3-2-1 technique, etc.)  
- Extra gentle reminders for motivation  

Designed to give the app a calming, supportive experience.

---

## 🛠️ Tech Stack

- **Frontend Framework:** React (TypeScript)  
- **Build Tool:** Vite  
- **Routing:** React Router  
- **Styles:** Tailwind CSS + custom components  
- **Data Storage:** Browser localStorage  
- **Icons:** Lucide Icons  
- **Project Structure:** Modular utilities and types  

---

## 🧱 Project Structure

```text
src/
  components/        # Navbar + UI components
  pages/             # All route pages (Create Plan, Today, Progress, Rewards, Support)
  types/
    detox.ts         # Plan, Log, Reward, Badge types
  utils/
    storage.ts       # Read/write to localStorage
    dates.ts         # Date helpers
    plan.ts          # Plan creation logic
    today.ts         # Daily log & mood logic
    progress.ts      # Progress & streak calculation
    rewards.ts       # Reward determination logic
    support.ts       # Support messages & exercises

---

##**Running the Project**

###**1.Clone the repository:**
git clone https://github.com/<your-username>/Digital-detox-hub.git
cd Digital-detox-hub
---
**2.Install dependencies:**
npm install

**3.Start development server:**
npm run dev

**4.Open the app:**
 http://localhost:5173/

**How It Works Internally (Short Summary)**

1. Plan is stored as a DetoxPlan object in localStorage.
2. Daily logs record completed blocks, activities, and mood.
3. Progress & streaks are computed from plan date range + logs.
4. Rewards are generated dynamically using calculated streaks & total completions.
5. Support messages adapt to today’s mood for a personalized experience.


**Use Case**

This project demonstrates:
1. UI/UX design
2. Component-based architecture
3. React Router navigation
4. State handling & user persistence
5. Utility-driven code structure
6. A complete, functioning wellbeing tool


**Future Enhancements (Optional)**

1. Cloud sync with user login
2. Push notifications / reminders
3. Exportable progress reports
4. Analytics dashboard




















