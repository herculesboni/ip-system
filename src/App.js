import React, { useState, useEffect, useCallback } from 'react';
import { Star, Trophy, Target, Calendar, Zap, CheckCircle, Plus, BarChart3, Clock, BookOpen, Dumbbell, Droplets, Coffee, Bed, Brain, Heart, Gift, Award, Eye, ChevronLeft, ChevronRight, RotateCcw, HelpCircle, X, Smile, Download, Flame, TrendingUp, Moon, DollarSign } from 'lucide-react';

// Функция безопасного получения из localStorage
const getFromStorage = (key, defaultValue) => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    return defaultValue;
  }
};

// Функция безопасного сохранения в localStorage
const setToStorage = (key, value) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn('Failed to save to localStorage:', error);
  }
};

// Интерактивный глаз компонент
const InteractiveEye = ({ scale = 1 }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [eyeRef, setEyeRef] = useState(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (eyeRef) {
        const rect = eyeRef.getBoundingClientRect();
        const eyeCenterX = rect.left + rect.width / 2;
        const eyeCenterY = rect.top + rect.height / 2;
        const angle = Math.atan2(e.clientY - eyeCenterY, e.clientX - eyeCenterX);
        const distance = Math.min(Math.hypot(e.clientX - eyeCenterX, e.clientY - eyeCenterY) / 150, 1);
        
        setMousePos({
          x: Math.cos(angle) * distance * 4 * scale,
          y: Math.sin(angle) * distance * 4 * scale
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [eyeRef, scale]);

  return (
    <div 
      ref={setEyeRef} 
      className="w-12 h-12 md:w-16 md:h-16 bg-neutral-900 rounded-full flex items-center justify-center shadow-sm relative border border-neutral-800"
    >
      <div className="w-8 h-8 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center relative overflow-hidden">
        <div 
          className="w-5 h-5 md:w-7 md:h-7 rounded-full flex items-center justify-center transition-transform duration-100 ease-out"
          style={{ 
            background: 'radial-gradient(circle, #171717 40%, #0a0a0a 70%, #000000 100%)',
            transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
          }}
        >
          <div className="w-2 h-2 md:w-3 md:h-3 bg-sky-500 rounded-full relative">
            <div className="w-0.5 h-0.5 md:w-1 md:h-1 bg-white rounded-full absolute top-0.5 left-0.5 opacity-60"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Компонент кнопки справки
const HelpButton = () => {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowHelp(true)}
        className="fixed bottom-6 right-6 w-10 h-10 bg-white border border-neutral-300 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all opacity-60 hover:opacity-100 z-40"
        title="Информация о приватности и использовании"
      >
        <HelpCircle className="w-5 h-5 text-neutral-600" />
      </button>

      {showHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50" onClick={() => setShowHelp(false)}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-medium text-neutral-900">О системе i.p</h2>
                <button
                  onClick={() => setShowHelp(false)}
                  className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-neutral-600" />
                </button>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium text-neutral-800 mb-3 flex items-center">
                  <span className="text-xl mr-2">🔒</span>
                  Ваши данные в безопасности
                </h3>
                <div className="space-y-2 text-sm text-neutral-600 font-light bg-neutral-50 rounded-xl p-4">
                  <p>• Все данные хранятся только у вас в браузере</p>
                  <p>• Никакая информация не отправляется на серверы</p>
                  <p>• Работает полностью офлайн после загрузки</p>
                  <p>• Данные сохраняются между сессиями</p>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={() => setShowHelp(false)}
                  className="bg-neutral-900 text-white px-6 py-2 rounded-xl hover:bg-neutral-800 transition-colors font-medium text-sm"
                >
                  Понятно!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const App = () => {
  // Состояние календаря (перенесено на верхний уровень)
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Основное состояние
  const [currentScreen, setCurrentScreen] = useState(0);
  const [week, setWeek] = useState(() => parseInt(getFromStorage('ip-week', '1')));
  const [points, setPoints] = useState(() => parseInt(getFromStorage('ip-points', '0')));
  const [level, setLevel] = useState(() => parseInt(getFromStorage('ip-level', '1')));
  const [totalPoints, setTotalPoints] = useState(() => parseInt(getFromStorage('ip-totalPoints', '0')));
  const [lastResetDate, setLastResetDate] = useState(() => getFromStorage('ip-lastReset', new Date().toDateString()));
  
  // Привычки и серии
  const [habits, setHabits] = useState(() => {
    const saved = getFromStorage('ip-habits', null);
    if (saved) return saved;
    return {
      wakeup: false, brush_morning: false, breakfast: false, sport: false,
      water_morning: false, vitamins: false, learning_morning: false,
      water: false, no_junk_food: false, no_sugar: false,
      foreign_language: false, book_speed: false, no_social: false,
      planning: false, meditation: false, day_review: false,
      sleep: false, brush_evening: false,
      outdoor_weekend: false, week_review: false
    };
  });

  const [streaks, setStreaks] = useState(() => getFromStorage('ip-streaks', {}));

  // Задачи разных типов
  const [dailyTasks, setDailyTasks] = useState(() => getFromStorage('ip-dailyTasks', []));
  const [weeklyGoals, setWeeklyGoals] = useState(() => getFromStorage('ip-weeklyGoals', []));
  const [monthlyProjects, setMonthlyProjects] = useState(() => getFromStorage('ip-monthlyProjects', []));
  const [completedHistory, setCompletedHistory] = useState(() => getFromStorage('ip-completedHistory', {}));
  
  const [newTask, setNewTask] = useState('');
  const [taskPriority, setTaskPriority] = useState(1);
  const [taskType, setTaskType] = useState('daily');

  // Трекеры
  const [mood, setMood] = useState(() => parseInt(getFromStorage('ip-todayMood', '5')));
  const [gratitude, setGratitude] = useState(() => getFromStorage('ip-gratitude', []));
  const [newGratitude, setNewGratitude] = useState('');
  const [sleepData, setSleepData] = useState(() => getFromStorage('ip-sleepData', {}));
  const [finances, setFinances] = useState(() => getFromStorage('ip-finances', []));

  const [achievements, setAchievements] = useState(() => getFromStorage('ip-achievements', []));
  const [weekPlan, setWeekPlan] = useState(() => getFromStorage('ip-weekPlan', {}));
  const [rewards, setRewards] = useState(() => {
    const saved = getFromStorage('ip-rewards', null);
    if (saved) return saved;
    return [
      { id: 1, name: 'Вкусный кофе', cost: 10, claimed: false, resetDays: 1 },
      { id: 2, name: 'Любимый десерт', cost: 15, claimed: false, resetDays: 1 },
      { id: 3, name: 'Часовой перерыв', cost: 20, claimed: false, resetDays: 1 },
      { id: 4, name: '2 часа ничего не делать', cost: 30, claimed: false, resetDays: 1 },
      { id: 5, name: 'Поесть что хочется', cost: 25, claimed: false, resetDays: 2 },
      { id: 6, name: 'Новая книга/игра', cost: 35, claimed: false, resetDays: 3 },
      { id: 7, name: 'Поход в кино', cost: 40, claimed: false, resetDays: 3 },
      { id: 8, name: 'Заказ еды', cost: 45, claimed: false, resetDays: 3 },
      { id: 9, name: 'День без планов', cost: 50, claimed: false, resetDays: 7 },
      { id: 10, name: 'Ужин в ресторане', cost: 60, claimed: false, resetDays: 7 },
      { id: 11, name: 'Шоппинг-день', cost: 65, claimed: false, resetDays: 7 },
      { id: 12, name: 'Новая одежда', cost: 70, claimed: false, resetDays: 14 },
      { id: 13, name: 'Массаж/SPA', cost: 80, claimed: false, resetDays: 7 },
      { id: 14, name: 'Билет на концерт/шоу', cost: 90, claimed: false, resetDays: 14 },
      { id: 15, name: 'Техника/гаджет', cost: 100, claimed: false, resetDays: 30 },
      { id: 16, name: 'Выходные за городом', cost: 120, claimed: false, resetDays: 30 },
    ];
  });

  // Конфигурация привычек
  const habitConfig = {
    wakeup: { name: 'Подъём в срок', points: 2, icon: Clock, color: 'text-blue-600', time: 'morning', desc: 'В одно время' },
    brush_morning: { name: 'Почистить зубы', points: 1, icon: Star, color: 'text-emerald-500', time: 'morning', desc: 'Утром' },
    breakfast: { name: 'Сделать завтрак', points: 2, icon: Coffee, color: 'text-amber-600', time: 'morning', desc: 'Здоровый' },
    sport: { name: 'Утренний спорт', points: 4, icon: Dumbbell, color: 'text-red-500', time: 'morning', desc: '30 мин' },
    water_morning: { name: 'Стакан воды', points: 1, icon: Droplets, color: 'text-cyan-500', time: 'morning', desc: 'Натощак' },
    vitamins: { name: 'Витамины', points: 1, icon: Heart, color: 'text-pink-500', time: 'morning', desc: 'С едой' },
    learning_morning: { name: 'Саморазвитие', points: 4, icon: BookOpen, color: 'text-violet-600', time: 'morning', desc: '30 мин без телефона' },
    
    water: { name: '2л воды за день', points: 3, icon: Droplets, color: 'text-blue-500', time: 'all-day', desc: 'В течение дня' },
    no_junk_food: { name: 'Без фастфуда', points: 3, icon: Target, color: 'text-green-600', time: 'all-day', desc: 'Весь день' },
    no_sugar: { name: 'Без сахара', points: 3, icon: Zap, color: 'text-yellow-500', time: 'all-day', desc: 'Контроль сахара' },
    foreign_language: { name: 'Иностранный язык', points: 4, icon: BookOpen, color: 'text-purple-600', time: 'flexible', desc: '30 мин практики' },
    book_speed: { name: 'Быстрое чтение', points: 4, icon: Brain, color: 'text-indigo-600', time: 'flexible', desc: '15-30 мин' },
    no_social: { name: 'Без соцсетей/мемов', points: 3, icon: Target, color: 'text-neutral-600', time: 'all-day', desc: 'Час подряд без телефона' },
    
    planning: { name: 'План на завтра', points: 3, icon: Calendar, color: 'text-indigo-500', time: 'evening', desc: 'Вечером' },
    meditation: { name: 'Медитация', points: 3, icon: Brain, color: 'text-purple-500', time: 'evening', desc: '10-15 минут' },
    day_review: { name: 'Разбор дня', points: 2, icon: BarChart3, color: 'text-orange-500', time: 'evening', desc: 'Что сделано' },
    sleep: { name: 'Сон в срок', points: 4, icon: Bed, color: 'text-slate-500', time: 'night', desc: 'В одно время' },
    brush_evening: { name: 'Почистить зубы', points: 1, icon: Star, color: 'text-emerald-500', time: 'night', desc: 'Перед сном' },
    
    outdoor_weekend: { name: '4 часа на улице', points: 8, icon: Coffee, color: 'text-green-500', time: 'weekend', desc: 'За неделю' },
    week_review: { name: 'Итоги недели', points: 6, icon: Trophy, color: 'text-yellow-500', time: 'weekend', desc: 'Анализ' }
  };

  const financialBonuses = [
    { id: 1, name: 'Получил доход', points: 100, desc: 'Любой заработок' },
    { id: 2, name: 'Крупная сделка', points: 200, desc: 'Большая сумма' },
    { id: 3, name: 'Инвестиция окупилась', points: 150, desc: 'Прибыль от инвестиций' },
  ];

  const screens = [
    { name: 'Привычки', icon: Trophy },
    { name: 'Цели', icon: Target },
    { name: 'Трекеры', icon: TrendingUp },
    { name: 'Планирование', icon: Clock },
    { name: 'Календарь', icon: Calendar },  
    { name: 'Награды', icon: Gift },
    { name: 'Статистика', icon: BarChart3 }
  ];

  const maxPoints = 70;
  const weekProgress = Math.min((points / maxPoints) * 100, 100);

  // Вычисляем уровень
  const calculateLevel = (totalPts) => Math.floor(totalPts / 100) + 1;
  const getPointsForNextLevel = () => (level * 100) - totalPoints;

  // Сохранение в localStorage с использованием useEffect
  useEffect(() => { setToStorage('ip-week', week); }, [week]);
  useEffect(() => { setToStorage('ip-points', points); }, [points]);
  useEffect(() => { setToStorage('ip-level', level); }, [level]);
  useEffect(() => { setToStorage('ip-totalPoints', totalPoints); }, [totalPoints]);
  useEffect(() => { setToStorage('ip-habits', habits); }, [habits]);
  useEffect(() => { setToStorage('ip-streaks', streaks); }, [streaks]);
  useEffect(() => { setToStorage('ip-dailyTasks', dailyTasks); }, [dailyTasks]);
  useEffect(() => { setToStorage('ip-weeklyGoals', weeklyGoals); }, [weeklyGoals]);
  useEffect(() => { setToStorage('ip-monthlyProjects', monthlyProjects); }, [monthlyProjects]);
  useEffect(() => { setToStorage('ip-todayMood', mood); }, [mood]);
  useEffect(() => { setToStorage('ip-gratitude', gratitude); }, [gratitude]);
  useEffect(() => { setToStorage('ip-sleepData', sleepData); }, [sleepData]);
  useEffect(() => { setToStorage('ip-finances', finances); }, [finances]);
  useEffect(() => { setToStorage('ip-achievements', achievements); }, [achievements]);
  useEffect(() => { setToStorage('ip-weekPlan', weekPlan); }, [weekPlan]);
  useEffect(() => { setToStorage('ip-rewards', rewards); }, [rewards]);
  useEffect(() => { setToStorage('ip-completedHistory', completedHistory); }, [completedHistory]);
  useEffect(() => { setToStorage('ip-lastReset', lastResetDate); }, [lastResetDate]);

  const getTimeUntilReset = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const diff = tomorrow - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}ч ${minutes}м`;
  };

  const addAchievement = useCallback((text) => {
    const newAchievement = { 
      id: Date.now(), 
      text, 
      time: new Date().toLocaleTimeString() 
    };
    setAchievements(prev => [...prev, newAchievement]);
  }, []);

  // Обновляем очки и уровень
  const updatePoints = useCallback((pointsToAdd) => {
    setPoints(prev => prev + pointsToAdd);
    setTotalPoints(prev => {
      const newTotal = prev + pointsToAdd;
      const newLevel = calculateLevel(newTotal);
      if (newLevel > level) {
        setLevel(newLevel);
        addAchievement(`🆙 Уровень ${newLevel} достигнут!`);
      }
      return newTotal;
    });
  }, [level, addAchievement]);

  // Обновляем серии для привычек
  const updateStreak = useCallback((habitKey, completed) => {
    const today = new Date().toDateString();
    setStreaks(prev => {
      const newStreaks = { ...prev };
      if (!newStreaks[habitKey]) {
        newStreaks[habitKey] = { count: 0, lastDate: null };
      }
      
      if (completed) {
        if (newStreaks[habitKey].lastDate !== today) {
          newStreaks[habitKey].count += 1;
          newStreaks[habitKey].lastDate = today;
          
          // Достижения за серии
          const streakCount = newStreaks[habitKey].count;
          if (streakCount === 7) addAchievement(`🔥 ${habitConfig[habitKey].name}: 7 дней подряд!`);
          if (streakCount === 30) addAchievement(`💎 ${habitConfig[habitKey].name}: месяц без перерыва!`);
        }
      } else {
        newStreaks[habitKey].count = 0;
      }
      
      return newStreaks;
    });
  }, [addAchievement, habitConfig]);

  const toggleHabit = useCallback((habitKey) => {
    const habit = habitConfig[habitKey];
    if (!habit) return;
    const today = new Date().toISOString().split('T')[0];

    setHabits(prevHabits => {
      const isCurrentlyActive = prevHabits[habitKey];
      const newHabits = { ...prevHabits, [habitKey]: !isCurrentlyActive };

      if (!isCurrentlyActive) {
        updatePoints(habit.points);
        updateStreak(habitKey, true);
        // Записываем в историю выполнения
        setCompletedHistory(prevHistory => {
          const dayHistory = prevHistory[today] || [];
          return {
            ...prevHistory,
            [today]: [...dayHistory, {
              id: `habit-${habitKey}`,
              text: habit.name,
              type: 'habit',
              points: habit.points,
              completedAt: new Date().toLocaleTimeString()
            }]
          };
        });
      } else {
        setPoints(prev => Math.max(0, prev - habit.points));
        updateStreak(habitKey, false);
        // Убираем из истории выполнения
        setCompletedHistory(prevHistory => {
          const dayHistory = (prevHistory[today] || []).filter(h => h.id !== `habit-${habitKey}`);
          return {
            ...prevHistory,
            [today]: dayHistory
          };
        });
      }

      return newHabits;
    });
  }, [habitConfig, updatePoints, updateStreak]);

  const addTask = useCallback(() => {
    if (!newTask.trim()) return;
    
    const task = {
      id: Date.now(),
      text: newTask.trim(),
      priority: taskPriority,
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    if (taskType === 'daily') {
      setDailyTasks(prev => [...prev, task]);
    } else if (taskType === 'weekly') {
      setWeeklyGoals(prev => [...prev, task]);
    } else if (taskType === 'monthly') {
      setMonthlyProjects(prev => [...prev, task]);
    }
    
    setNewTask('');
  }, [newTask, taskPriority, taskType]);

  const toggleTask = useCallback((taskId, taskType) => {
    const today = new Date().toISOString().split('T')[0];
    
    const toggleTaskInArray = (prevTasks) => {
      const taskIndex = prevTasks.findIndex(t => t.id === taskId);
      if (taskIndex === -1) return prevTasks;

      const task = prevTasks[taskIndex];
      const newTasks = [...prevTasks];
      newTasks[taskIndex] = { ...task, completed: !task.completed };

      if (!task.completed) {
        updatePoints(task.priority);
        // Записываем в историю выполнения
        setCompletedHistory(prevHistory => {
          const dayHistory = prevHistory[today] || [];
          return {
            ...prevHistory,
            [today]: [...dayHistory, {
              id: task.id,
              text: task.text,
              type: taskType,
              points: task.priority,
              completedAt: new Date().toLocaleTimeString()
            }]
          };
        });
      } else {
        setPoints(prev => Math.max(0, prev - task.priority));
        // Убираем из истории выполнения
        setCompletedHistory(prevHistory => {
          const dayHistory = (prevHistory[today] || []).filter(h => h.id !== task.id);
          return {
            ...prevHistory,
            [today]: dayHistory
          };
        });
      }

      return newTasks;
    };

    if (taskType === 'daily') {
      setDailyTasks(toggleTaskInArray);
    } else if (taskType === 'weekly') {
      setWeeklyGoals(toggleTaskInArray);
    } else if (taskType === 'monthly') {
      setMonthlyProjects(toggleTaskInArray);
    }
  }, [updatePoints]);

  const addGratitude = useCallback(() => {
    if (!newGratitude.trim()) return;
    
    const gratitudeItem = {
      id: Date.now(),
      text: newGratitude.trim(),
      date: new Date().toDateString()
    };
    
    setGratitude(prev => [...prev, gratitudeItem]);
    setNewGratitude('');
  }, [newGratitude]);

  const claimReward = useCallback((rewardId) => {
    setRewards(prevRewards => {
      const rewardIndex = prevRewards.findIndex(r => r.id === rewardId);
      if (rewardIndex === -1) return prevRewards;

      const reward = prevRewards[rewardIndex];
      if (points < reward.cost || reward.claimed) return prevRewards;

      setPoints(prevPoints => prevPoints - reward.cost);
      addAchievement(`🎁 Награда: ${reward.name}!`);

      const newRewards = [...prevRewards];
      newRewards[rewardIndex] = { ...reward, claimed: true, claimedAt: Date.now() };

      return newRewards;
    });
  }, [points, addAchievement]);

  const addFinancialBonus = useCallback((bonusId) => {
    const bonus = financialBonuses.find(b => b.id === bonusId);
    if (!bonus) return;

    updatePoints(bonus.points);
    addAchievement(`💰 ${bonus.name}: +${bonus.points} очков!`);
  }, [addAchievement, updatePoints]);

  const changeScreen = useCallback((direction) => {
    setCurrentScreen(prev => {
      if (direction === 'next') {
        return prev >= screens.length - 1 ? 0 : prev + 1;
      } else {
        return prev <= 0 ? screens.length - 1 : prev - 1;
      }
    });
  }, [screens.length]);

  // Экспорт данных
  const exportData = useCallback(() => {
    const data = {
      week, points, level, totalPoints, habits, streaks, dailyTasks, weeklyGoals, 
      monthlyProjects, mood, gratitude, achievements, exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ip-system-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    addAchievement('📊 Данные экспортированы!');
  }, [week, points, level, totalPoints, habits, streaks, dailyTasks, weeklyGoals, monthlyProjects, mood, gratitude, achievements, addAchievement]);

  // Сброс в новый день
  useEffect(() => {
    const checkNewDay = () => {
      const today = new Date().toDateString();
      if (today !== lastResetDate) {
        // Сбрасываем ежедневные привычки
        setHabits(prev => {
          const newHabits = { ...prev };
          Object.keys(habitConfig).forEach(key => {
            if (habitConfig[key].time !== 'weekend') {
              newHabits[key] = false;
            }
          });
          return newHabits;
        });

        // Сбрасываем награды по таймеру
        setRewards(prev => prev.map(reward => {
          if (reward.claimed && reward.claimedAt) {
            const daysSinceClaimed = Math.floor((Date.now() - reward.claimedAt) / (24 * 60 * 60 * 1000));
            if (daysSinceClaimed >= reward.resetDays) {
              return { ...reward, claimed: false, claimedAt: null };
            }
          }
          return reward;
        }));

        setLastResetDate(today);
        
        if (new Date().getDay() === 1) {
          setWeek(prev => prev + 1);
          addAchievement(`🎯 Неделя ${week + 1} началась!`);
        } else {
          addAchievement('🌅 Новый день!');
        }
      }
    };

    checkNewDay();
    const interval = setInterval(checkNewDay, 60000);
    return () => clearInterval(interval);
  }, [lastResetDate, week, habitConfig, addAchievement]);

  // Свайп и клавиатура
  useEffect(() => {
    let startX = 0;
    
    const handleTouchStart = (e) => {
      startX = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;
      
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          changeScreen('next');
        } else {
          changeScreen('prev');
        }
      }
    };

    const handleKeydown = (e) => {
      if (e.key === 'ArrowLeft') changeScreen('prev');
      if (e.key === 'ArrowRight') changeScreen('next');
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('keydown', handleKeydown);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [changeScreen]);

  // Календарные функции (перенесены из case блока)
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    for (let d = new Date(startDate); d <= lastDay || days.length % 7 !== 0; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }
    return days;
  };

  const getCompletedTasksForDate = (date) => {
    const dateString = date.toISOString().split('T')[0];
    return completedHistory[dateString] || [];
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(newMonth.getMonth() + direction);
      return newMonth;
    });
  };

  // Компонент привычки
  const HabitCard = ({ habitKey, habit }) => {
    const IconComponent = habit.icon;
    const isActive = habits[habitKey];
    const streak = streaks[habitKey]?.count || 0;

    return (
      <div
        onClick={() => toggleHabit(habitKey)}
        className={`group relative p-5 rounded-2xl cursor-pointer transition-all duration-300 border ${
          isActive 
            ? 'bg-neutral-900 text-white border-neutral-800 shadow-xl' 
            : 'bg-white border-neutral-200 hover:border-neutral-300 shadow-sm hover:shadow-md'
        }`}
      >
        {streak > 0 && (
          <div className="absolute top-2 right-2 flex items-center space-x-1 text-xs">
            <Flame className="w-3 h-3 text-orange-500" />
            <span className={isActive ? 'text-orange-300' : 'text-orange-600'}>{streak}</span>
          </div>
        )}
        
        <div className="flex items-start space-x-4">
          <div className={`flex-shrink-0 p-2 rounded-xl ${isActive ? 'bg-white bg-opacity-10' : 'bg-neutral-50'}`}>
            <IconComponent className={`w-6 h-6 ${isActive ? 'text-white' : habit.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className={`font-medium text-base leading-tight mb-1 ${isActive ? 'text-white' : 'text-neutral-900'}`}>
              {habit.name}
            </h4>
            <p className={`text-sm leading-relaxed mb-2 ${isActive ? 'text-neutral-300' : 'text-neutral-600'}`}>
              {habit.desc}
            </p>
            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium ${isActive ? 'text-neutral-400' : 'text-neutral-500'}`}>
                {habit.points} очков
              </span>
              {isActive && <CheckCircle className="w-5 h-5 text-green-400" />}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 0: // Привычки
        return (
          <div className="space-y-8">
            {/* Прогресс и уровень */}
            <div className="bg-white rounded-3xl shadow-sm p-8 border border-neutral-100">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-2xl flex items-center justify-center text-white font-light text-2xl">
                    {level}
                  </div>
                  <div>
                    <h2 className="text-3xl font-light text-neutral-900">Уровень {level}</h2>
                    <p className="text-neutral-600 font-light">{points} очков • {getPointsForNextLevel()} до следующего уровня</p>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <RotateCcw className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                    <p className="text-xs text-neutral-500 font-medium">Сброс через</p>
                    <p className="text-xs text-neutral-700 font-medium">{getTimeUntilReset()}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-neutral-600">Недельный прогресс</span>
                  <span className="text-sm font-medium text-neutral-600">{points} / {maxPoints}</span>
                </div>
                <div className="w-full bg-neutral-100 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-neutral-600 to-neutral-800 h-2 rounded-full transition-all duration-700"
                    style={{ width: `${weekProgress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Привычки по категориям */}
            <div className="bg-white rounded-3xl shadow-sm p-8 border border-neutral-100">
              <h3 className="text-2xl font-light text-neutral-900 mb-8">Ежедневные привычки</h3>
              
              {/* Утренние */}
              <div className="mb-10">
                <h4 className="text-lg font-medium text-neutral-800 mb-6 flex items-center">
                  <span className="text-2xl mr-3">🌅</span>
                  Утренние привычки
                </h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {Object.entries(habitConfig)
                    .filter(([_, habit]) => habit.time === 'morning')
                    .map(([key, habit]) => (
                      <HabitCard key={key} habitKey={key} habit={habit} />
                    ))}
                </div>
              </div>

              {/* В течение дня */}
              <div className="mb-10">
                <h4 className="text-lg font-medium text-neutral-800 mb-6 flex items-center">
                  <span className="text-2xl mr-3">⏰</span>
                  В течение дня
                </h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {Object.entries(habitConfig)
                    .filter(([_, habit]) => habit.time === 'flexible' || habit.time === 'all-day')
                    .map(([key, habit]) => (
                      <HabitCard key={key} habitKey={key} habit={habit} />
                    ))}
                </div>
              </div>

              {/* Вечерние */}
              <div className="mb-10">
                <h4 className="text-lg font-medium text-neutral-800 mb-6 flex items-center">
                  <span className="text-2xl mr-3">🌙</span>
                  Вечерние привычки
                </h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {Object.entries(habitConfig)
                    .filter(([_, habit]) => habit.time === 'evening' || habit.time === 'night')
                    .map(([key, habit]) => (
                      <HabitCard key={key} habitKey={key} habit={habit} />
                    ))}
                </div>
              </div>

              {/* Недельные */}
              <div>
                <h4 className="text-lg font-medium text-neutral-800 mb-6 flex items-center">
                  <span className="text-2xl mr-3">🏖️</span>
                  Недельные задачи
                </h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {Object.entries(habitConfig)
                    .filter(([_, habit]) => habit.time === 'weekend')
                    .map(([key, habit]) => (
                      <HabitCard key={key} habitKey={key} habit={habit} />
                    ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 1: // Цели
        return (
          <div className="space-y-8">
            {/* Добавление задач */}
            <div className="bg-white rounded-3xl shadow-sm p-8 border border-neutral-100">
              <h3 className="text-2xl font-light text-neutral-900 mb-8">Добавить цель</h3>
              
              <div className="flex flex-col lg:flex-row gap-4 mb-8">
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Новая цель..."
                  className="flex-1 p-4 border border-neutral-200 rounded-2xl focus:border-neutral-400 focus:outline-none text-base font-light placeholder-neutral-400"
                  onKeyPress={(e) => e.key === 'Enter' && addTask()}
                />
                <div className="flex gap-3">
                  <select
                    value={taskType}
                    onChange={(e) => setTaskType(e.target.value)}
                    className="p-4 border border-neutral-200 rounded-2xl focus:border-neutral-400 focus:outline-none text-base font-light"
                  >
                    <option value="daily">Сегодня</option>
                    <option value="weekly">Эта неделя</option>
                    <option value="monthly">Этот месяц</option>
                  </select>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(Number(e.target.value))}
                    className="p-4 border border-neutral-200 rounded-2xl focus:border-neutral-400 focus:outline-none text-base font-light"
                  >
                    <option value={1}>1 очко</option>
                    <option value={2}>2 очка</option>
                    <option value={3}>3 очка</option>
                    <option value={5}>5 очков</option>
                  </select>
                  <button
                    onClick={addTask}
                    className="bg-neutral-900 text-white p-4 rounded-2xl hover:bg-neutral-800 transition-colors"
                  >
                    <Plus className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>

            {/* Ежедневные задачи */}
            <div className="bg-white rounded-3xl shadow-sm p-8 border border-neutral-100">
              <h3 className="text-xl font-medium text-neutral-900 mb-6 flex items-center">
                <span className="text-2xl mr-3">📋</span>
                Задачи на сегодня
              </h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {dailyTasks.length === 0 ? (
                  <p className="text-neutral-500 font-light">Задач на сегодня нет</p>
                ) : (
                  dailyTasks.map(task => (
                    <div
                      key={task.id}
                      onClick={() => toggleTask(task.id, 'daily')}
                      className={`p-4 rounded-xl cursor-pointer transition-all border ${
                        task.completed
                          ? 'bg-neutral-50 border-neutral-200 opacity-60'
                          : 'bg-white border-neutral-200 hover:shadow-md hover:border-neutral-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`font-light ${task.completed ? 'line-through text-neutral-500' : 'text-neutral-900'}`}>
                          {task.text}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded-full">
                            {task.priority} очк
                          </span>
                          {task.completed && <CheckCircle className="w-4 h-4 text-green-500" />}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Недельные цели */}
            <div className="bg-white rounded-3xl shadow-sm p-8 border border-neutral-100">
              <h3 className="text-xl font-medium text-neutral-900 mb-6 flex items-center">
                <span className="text-2xl mr-3">🎯</span>
                Цели на неделю
              </h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {weeklyGoals.length === 0 ? (
                  <p className="text-neutral-500 font-light">Недельных целей нет</p>
                ) : (
                  weeklyGoals.map(task => (
                    <div
                      key={task.id}
                      onClick={() => toggleTask(task.id, 'weekly')}
                      className={`p-4 rounded-xl cursor-pointer transition-all border border-l-4 border-l-blue-400 ${
                        task.completed
                          ? 'bg-neutral-50 border-neutral-200 opacity-60'
                          : 'bg-white border-neutral-200 hover:shadow-md hover:border-neutral-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`font-light ${task.completed ? 'line-through text-neutral-500' : 'text-neutral-900'}`}>
                          {task.text}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                            {task.priority} очк
                          </span>
                          {task.completed && <CheckCircle className="w-4 h-4 text-green-500" />}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Месячные проекты */}
            <div className="bg-white rounded-3xl shadow-sm p-8 border border-neutral-100">
              <h3 className="text-xl font-medium text-neutral-900 mb-6 flex items-center">
                <span className="text-2xl mr-3">🚀</span>
                Проекты на месяц
              </h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {monthlyProjects.length === 0 ? (
                  <p className="text-neutral-500 font-light">Месячных проектов нет</p>
                ) : (
                  monthlyProjects.map(task => (
                    <div
                      key={task.id}
                      onClick={() => toggleTask(task.id, 'monthly')}
                      className={`p-4 rounded-xl cursor-pointer transition-all border border-l-4 border-l-purple-400 ${
                        task.completed
                          ? 'bg-neutral-50 border-neutral-200 opacity-60'
                          : 'bg-white border-neutral-200 hover:shadow-md hover:border-neutral-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`font-light ${task.completed ? 'line-through text-neutral-500' : 'text-neutral-900'}`}>
                          {task.text}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                            {task.priority} очк
                          </span>
                          {task.completed && <CheckCircle className="w-4 h-4 text-green-500" />}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        );

      case 2: // Трекеры
        return (
          <div className="space-y-8">
            {/* Настроение */}
            <div className="bg-white rounded-3xl shadow-sm p-8 border border-neutral-100">
              <h3 className="text-xl font-medium text-neutral-900 mb-6 flex items-center">
                <Smile className="w-6 h-6 mr-3 text-yellow-500" />
                Настроение сегодня
              </h3>
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-sm text-neutral-600">Ужасно</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={mood}
                  onChange={(e) => setMood(parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm text-neutral-600">Отлично</span>
              </div>
              <div className="text-center">
                <span className="text-3xl font-light text-neutral-900">{mood}/10</span>
                <p className="text-sm text-neutral-600 mt-1">
                  {mood <= 3 ? 'Трудный день' : mood <= 6 ? 'Нормально' : mood <= 8 ? 'Хорошо' : 'Превосходно'}
                </p>
              </div>
            </div>

            {/* Журнал благодарностей */}
            <div className="bg-white rounded-3xl shadow-sm p-8 border border-neutral-100">
              <h3 className="text-xl font-medium text-neutral-900 mb-6 flex items-center">
                <Heart className="w-6 h-6 mr-3 text-pink-500" />
                Благодарности
              </h3>
              <div className="flex gap-4 mb-6">
                <input
                  type="text"
                  value={newGratitude}
                  onChange={(e) => setNewGratitude(e.target.value)}
                  placeholder="За что вы благодарны сегодня?"
                  className="flex-1 p-3 border border-neutral-200 rounded-xl focus:border-neutral-400 focus:outline-none text-sm font-light placeholder-neutral-400"
                  onKeyPress={(e) => e.key === 'Enter' && addGratitude()}
                />
                <button
                  onClick={addGratitude}
                  className="bg-pink-500 text-white px-4 py-3 rounded-xl hover:bg-pink-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {gratitude.slice(-5).reverse().map(item => (
                  <div key={item.id} className="bg-pink-50 rounded-lg p-3">
                    <p className="text-sm text-neutral-700">{item.text}</p>
                    <p className="text-xs text-neutral-500 mt-1">{item.date}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Финансовые достижения */}
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-3xl p-8 text-white">
              <h3 className="text-xl font-medium mb-2 flex items-center">
                <DollarSign className="w-6 h-6 mr-3" />
                Финансовые достижения
              </h3>
              <p className="text-emerald-100 font-light mb-6">Отмечайте доходы и успехи</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {financialBonuses.map(bonus => (
                  <button
                    key={bonus.id}
                    onClick={() => addFinancialBonus(bonus.id)}
                    className="bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl p-4 text-left hover:bg-opacity-20 transition-all"
                  >
                    <h4 className="font-medium mb-1">{bonus.name}</h4>
                    <p className="text-emerald-100 text-sm font-light mb-2">{bonus.desc}</p>
                    <p className="text-white font-medium text-sm">+{bonus.points} очков</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 3: // Планирование недели
        const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
        const hours = Array.from({ length: 18 }, (_, i) => i + 6);

        return (
          <div className="bg-white rounded-3xl shadow-sm p-8 border border-neutral-100">
            <div className="mb-8">
              <h3 className="text-2xl font-light text-neutral-900 mb-2">Планирование недели</h3>
              <p className="text-neutral-600 font-light">Расставьте дела по часам на всю неделю</p>
            </div>
            
            <div className="overflow-x-auto">
              <div className="min-w-full" style={{ minWidth: '800px' }}>
                {/* Header с днями недели */}
                <div className="grid grid-cols-8 gap-2 mb-4 sticky top-0 bg-white z-10">
                  <div className="p-3 text-center font-medium text-neutral-700 bg-neutral-50 rounded-xl">
                    Время
                  </div>
                  {days.map(day => (
                    <div key={day} className="p-3 text-center font-medium text-neutral-700 bg-neutral-50 rounded-xl">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Сетка планирования */}
                <div className="space-y-2 max-h-[70vh] overflow-y-auto">
                  {hours.map(hour => (
                    <div key={hour} className="grid grid-cols-8 gap-2">
                      <div className="p-3 text-center font-medium text-neutral-600 bg-neutral-50 rounded-xl min-h-[80px] flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-sm">{hour}:00</div>
                          {hour < 23 && <div className="text-xs text-neutral-400">↓</div>}
                        </div>
                      </div>
                      {days.map((day, dayIndex) => {
                        const key = `${dayIndex}-${hour}`;
                        return (
                          <textarea
                            key={key}
                            value={weekPlan[key] || ''}
                            onChange={(e) => setWeekPlan(prev => ({ ...prev, [key]: e.target.value }))}
                            placeholder="Добавить план..."
                            className="p-3 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-400 focus:shadow-sm min-h-[80px] resize-none font-light placeholder-neutral-400 transition-all"
                            style={{ 
                              background: weekPlan[key] ? 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' : 'white' 
                            }}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Полезные советы */}
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
              <h4 className="font-medium text-neutral-800 mb-3 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-blue-600" />
                Советы по планированию
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-neutral-600">
                <div>
                  <p className="mb-2">• <strong>Утро (6-9):</strong> Привычки и важные дела</p>
                  <p className="mb-2">• <strong>День (9-18):</strong> Основная работа и встречи</p>
                </div>
                <div>
                  <p className="mb-2">• <strong>Вечер (18-22):</strong> Отдых и планирование</p>
                  <p className="mb-2">• <strong>Выходные:</strong> Восстановление и хобби</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 4: // Календарь выполненных целей
        const calendarDays = getDaysInMonth(currentMonth);
        const today = new Date();
        const todayString = today.toISOString().split('T')[0];

        return (
          <div className="space-y-8">
            {/* Календарь */}
            <div className="bg-white rounded-3xl shadow-sm p-8 border border-neutral-100">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-light text-neutral-900">Календарь достижений</h3>
                  <p className="text-neutral-600 font-light">История выполненных задач и привычек</p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => navigateMonth(-1)}
                    className="p-2 bg-neutral-50 hover:bg-neutral-100 rounded-xl transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-neutral-600" />
                  </button>
                  <h4 className="text-lg font-medium text-neutral-800 min-w-[140px] text-center">
                    {currentMonth.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}
                  </h4>
                  <button
                    onClick={() => navigateMonth(1)}
                    className="p-2 bg-neutral-50 hover:bg-neutral-100 rounded-xl transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-neutral-600" />
                  </button>
                </div>
              </div>
              
              {/* Дни недели */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'].map(day => (
                  <div key={day} className="p-3 text-center font-medium text-neutral-500 text-sm">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Календарная сетка */}
              <div className="grid grid-cols-7 gap-2 mb-6">
                {calendarDays.map((day, index) => {
                  const dateString = day.toISOString().split('T')[0];
                  const completedTasks = getCompletedTasksForDate(day);
                  const isToday = dateString === todayString;
                  const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
                  const hasActivity = completedTasks.length > 0;
                  
                  return (
                    <button
                      key={index}
                      onClick={() => hasActivity && setSelectedDate(dateString)}
                      className={`relative p-3 rounded-xl text-sm font-medium transition-all min-h-[60px] ${
                        isToday 
                          ? 'bg-neutral-900 text-white' 
                          : hasActivity
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 cursor-pointer'
                            : isCurrentMonth
                              ? 'bg-neutral-50 text-neutral-400'
                              : 'text-neutral-300'
                      }`}
                      disabled={!hasActivity}
                    >
                      <div className="flex flex-col items-center">
                        <span>{day.getDate()}</span>
                        {hasActivity && (
                          <div className="flex items-center space-x-1 mt-1">
                            <div className={`w-1.5 h-1.5 rounded-full ${isToday ? 'bg-white' : 'bg-emerald-600'}`} />
                            <span className={`text-xs ${isToday ? 'text-white' : 'text-emerald-700'}`}>
                              {completedTasks.length}
                            </span>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
              
              {/* Легенда */}
              <div className="flex items-center justify-center space-x-8 text-sm text-neutral-600">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-neutral-900 rounded"></div>
                  <span>Сегодня</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-emerald-100 border border-emerald-200 rounded"></div>
                  <span>Выполненные задачи</span>
                </div>
              </div>
            </div>
            
            {/* Детали выбранного дня */}
            {selectedDate && (
              <div className="bg-white rounded-3xl shadow-sm p-8 border border-neutral-100">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-xl font-medium text-neutral-900">
                    {new Date(selectedDate).toLocaleDateString('ru-RU', { 
                      weekday: 'long', 
                      day: 'numeric', 
                      month: 'long' 
                    })}
                  </h4>
                  <button
                    onClick={() => setSelectedDate(null)}
                    className="p-2 hover:bg-neutral-100 rounded-xl transition-colors"
                  >
                    <X className="w-4 h-4 text-neutral-600" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  {completedHistory[selectedDate]?.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          item.type === 'habit' ? 'bg-blue-100' :
                          item.type === 'daily' ? 'bg-emerald-100' :
                          item.type === 'weekly' ? 'bg-purple-100' : 'bg-orange-100'
                        }`}>
                          {item.type === 'habit' ? <Trophy className="w-4 h-4 text-blue-600" /> :
                           item.type === 'daily' ? <CheckCircle className="w-4 h-4 text-emerald-600" /> :
                           item.type === 'weekly' ? <Target className="w-4 h-4 text-purple-600" /> :
                           <Star className="w-4 h-4 text-orange-600" />}
                        </div>
                        <div>
                          <p className="font-medium text-neutral-900">{item.text}</p>
                          <p className="text-xs text-neutral-500">{item.completedAt}</p>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-neutral-600">+{item.points}</span>
                    </div>
                  )) || []}
                </div>
                
                {/* Итоги дня */}
                <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl border border-emerald-200">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-neutral-800">Итого за день:</span>
                    <span className="font-medium text-emerald-700">
                      +{completedHistory[selectedDate]?.reduce((sum, item) => sum + item.points, 0) || 0} очков
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 5: // Награды
        return (
          <div className="space-y-8">
            <div className="bg-white rounded-3xl shadow-sm p-8 border border-neutral-100">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-light text-neutral-900">Система наград</h3>
                  <p className="text-neutral-600 font-light">Тратьте очки на приятные вещи</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-light text-neutral-900">{points}</p>
                  <p className="text-neutral-600 font-light">очков</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {rewards.map(reward => {
                  const canClaim = points >= reward.cost && !reward.claimed;
                  return (
                    <div
                      key={reward.id}
                      onClick={() => canClaim && claimReward(reward.id)}
                      className={`p-4 rounded-2xl border transition-all ${
                        reward.claimed
                          ? 'bg-emerald-50 border-emerald-200'
                          : canClaim
                            ? 'bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-md cursor-pointer'
                            : 'bg-neutral-50 border-neutral-200 opacity-60'
                      }`}
                    >
                      <div className="text-center">
                        <div className="mb-3">
                          {reward.claimed ? (
                            <Award className="w-8 h-8 text-emerald-500 mx-auto" />
                          ) : (
                            <Gift className={`w-8 h-8 mx-auto ${canClaim ? 'text-neutral-700' : 'text-neutral-400'}`} />
                          )}
                        </div>
                        <h4 className="font-medium text-neutral-900 mb-2 text-sm leading-tight">{reward.name}</h4>
                        <p className={`font-light text-xs mb-2 ${
                          reward.claimed ? 'text-emerald-600' : 
                          canClaim ? 'text-neutral-600' : 'text-red-500'
                        }`}>
                          {reward.claimed ? 'Получено!' : 
                           canClaim ? `${reward.cost} очков` : 
                           `Нужно ${reward.cost} очков`}
                        </p>
                        {reward.claimed && (
                          <p className="text-xs text-neutral-500">
                            Через {reward.resetDays} {reward.resetDays === 1 ? 'день' : 'дней'}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 6: // Статистика
        const topStreaks = Object.entries(streaks)
          .sort(([,a], [,b]) => b.count - a.count)
          .slice(0, 5)
          .filter(([,streak]) => streak.count > 0);

        return (
          <div className="space-y-8">
            <div className="bg-white rounded-3xl shadow-sm p-8 border border-neutral-100">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-light text-neutral-900">Статистика и достижения</h3>
                <button
                  onClick={exportData}
                  className="flex items-center space-x-2 bg-neutral-100 text-neutral-700 px-4 py-2 rounded-xl hover:bg-neutral-200 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span className="text-sm">Экспорт</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="font-medium text-neutral-800 mb-6">Текущие показатели</h4>
                  {[
                    { label: 'Уровень', value: level },
                    { label: 'Очки накоплено', value: points },
                    { label: 'Всего очков заработано', value: totalPoints },
                    { label: 'Текущая неделя', value: week },
                    { label: 'Выполнено привычек сегодня', value: `${Object.values(habits).filter(Boolean).length}/20` },
                    { label: 'Активных целей', value: [...dailyTasks, ...weeklyGoals, ...monthlyProjects].filter(t => !t.completed).length },
                    { label: 'Настроение сегодня', value: `${mood}/10` }
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center p-4 bg-neutral-50 rounded-xl">
                      <span className="text-neutral-700 font-light">{item.label}</span>
                      <span className="font-medium text-neutral-900">{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-6">
                  {/* Лучшие серии */}
                  <div>
                    <h4 className="font-medium text-neutral-800 mb-4 flex items-center">
                      <Flame className="w-5 h-5 mr-2 text-orange-500" />
                      Лучшие серии
                    </h4>
                    <div className="space-y-2">
                      {topStreaks.length === 0 ? (
                        <p className="text-neutral-500 font-light text-sm">Серий пока нет</p>
                      ) : (
                        topStreaks.map(([habitKey, streak]) => (
                          <div key={habitKey} className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                            <span className="text-sm text-neutral-700">{habitConfig[habitKey]?.name}</span>
                            <span className="text-sm font-medium text-orange-600">{streak.count} дней</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Достижения */}
                  <div>
                    <h4 className="font-medium text-neutral-800 mb-4">Последние достижения</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {achievements.length === 0 ? (
                        <p className="text-neutral-500 font-light text-sm">Достижений пока нет</p>
                      ) : (
                        achievements.slice(-6).reverse().map(achievement => (
                          <div key={achievement.id} className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                            <p className="font-medium text-neutral-800 text-sm">{achievement.text}</p>
                            <p className="text-xs text-neutral-500 font-light mt-1">{achievement.time}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Информация о сбросе */}
            <div className="bg-neutral-50 rounded-3xl p-8 border border-neutral-200">
              <h4 className="font-medium text-neutral-800 mb-4 flex items-center">
                <RotateCcw className="w-5 h-5 mr-2" />
                Как работает система
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm font-light text-neutral-600">
                <div>
                  <h5 className="font-medium text-neutral-800 mb-2">Ежедневный сброс (00:00)</h5>
                  <ul className="space-y-1">
                    <li>• Ежедневные привычки сбрасываются</li>
                    <li>• Недельные и месячные цели остаются</li>
                    <li>• Очки и уровень сохраняются</li>
                    <li>• Серии продолжаются при выполнении</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-neutral-800 mb-2">Награды</h5>
                  <ul className="space-y-1">
                    <li>• Разные периоды сброса (1-30 дней)</li>
                    <li>• Кофе и десерты - каждый день</li>
                    <li>• SPA и рестораны - раз в неделю</li>
                    <li>• Крупные покупки - раз в месяц</li>
                  </ul>
                </div>
              </div>
              <p className="mt-4 text-neutral-500 text-xs font-light">
                До следующего сброса: {getTimeUntilReset()}
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        
        {/* Header */}
        <div className="text-center py-8 mb-12">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <InteractiveEye />
            <h1 className="text-4xl md:text-6xl font-extralight text-neutral-900 tracking-tight">i.p</h1>
          </div>
          <p className="text-neutral-600 font-light tracking-wide">Система личной эффективности</p>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mb-12">
          <button
            onClick={() => changeScreen('prev')}
            className="p-3 bg-white rounded-full shadow-sm hover:shadow-md transition-all border border-neutral-100"
          >
            <ChevronLeft className="w-6 h-6 text-neutral-600" />
          </button>

          <div className="flex space-x-1 overflow-x-auto">
            {screens.map((screen, index) => {
              const IconComponent = screen.icon;
              return (
                <button
                  key={index}
                  onClick={() => setCurrentScreen(index)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-2xl font-light transition-all whitespace-nowrap ${
                    currentScreen === index
                      ? 'bg-neutral-900 text-white shadow-md'
                      : 'bg-white text-neutral-600 hover:bg-neutral-50 shadow-sm border border-neutral-100'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="text-sm tracking-wide">{screen.name}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => changeScreen('next')}
            className="p-3 bg-white rounded-full shadow-sm hover:shadow-md transition-all border border-neutral-100"
          >
            <ChevronRight className="w-6 h-6 text-neutral-600" />
          </button>
        </div>

        {/* Content */}
        <div className="mb-12">
          {renderScreen()}
        </div>

        {/* Footer */}
        <div className="text-center py-8">
          <div className="bg-gradient-to-r from-neutral-800 to-neutral-900 rounded-3xl shadow-sm p-8 text-center">
            <p className="text-white font-light text-lg tracking-wide mb-2">
              "Радуем себя не тогда, когда есть возможность и деньги,<br className="hidden md:block" /> а тогда, когда доделали важные дела"
            </p>
            <p className="text-neutral-400 font-light tracking-wide">— Система личной эффективности</p>
          </div>
        </div>
      </div>

      {/* Кнопка справки */}
      <HelpButton />
    </div>
  );
};

export default App;
