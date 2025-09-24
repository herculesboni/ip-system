import React, { useState, useEffect, useCallback } from 'react';
import { Star, Trophy, Target, Calendar, Zap, CheckCircle, Plus, BarChart3, Clock, BookOpen, Dumbbell, Droplets, Coffee, Bed, Brain, Heart, Gift, Award, ChevronLeft, ChevronRight, RotateCcw, HelpCircle, X, Smile, Download, Flame, TrendingUp, DollarSign } from 'lucide-react';

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
        className="fixed bottom-6 right-6 w-12 h-12 bg-white border border-neutral-300 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all opacity-70 hover:opacity-100 z-40 animate-pulse hover:animate-none"
        title="Информация о приватности и использовании"
      >
        <HelpCircle className="w-6 h-6 text-neutral-600" />
      </button>

      {showHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50" onClick={() => setShowHelp(false)}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-medium text-neutral-900">О системе i.p</h2>
                <button
                  onClick={() => setShowHelp(false)}
                  className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-neutral-600" />
                </button>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-medium text-neutral-800 mb-4 flex items-center">
                  <span className="text-2xl mr-3">🔒</span>
                  Ваши данные в полной безопасности
                </h3>
                <div className="space-y-3 text-sm text-neutral-600 font-light bg-neutral-50 rounded-xl p-6">
                  <p>✅ <strong>Все данные хранятся только у вас</strong> в браузере на устройстве</p>
                  <p>✅ <strong>Никакая информация не отправляется</strong> на серверы или третьим лицам</p>
                  <p>✅ <strong>Работает полностью офлайн</strong> после первой загрузки страницы</p>
                  <p>✅ <strong>Данные сохраняются между сессиями</strong> в localStorage браузера</p>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={() => setShowHelp(false)}
                  className="bg-neutral-900 text-white px-8 py-3 rounded-xl hover:bg-neutral-800 transition-colors font-medium"
                >
                  Понятно, начинаем!
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
  // Основное состояние
  const [currentScreen, setCurrentScreen] = useState(0);
  const [week, setWeek] = useState(() => parseInt(localStorage.getItem('ip-week') || '1'));
  const [points, setPoints] = useState(() => parseInt(localStorage.getItem('ip-points') || '0'));
  const [level, setLevel] = useState(() => parseInt(localStorage.getItem('ip-level') || '1'));
  const [totalPoints, setTotalPoints] = useState(() => parseInt(localStorage.getItem('ip-totalPoints') || '0'));
  const [lastResetDate, setLastResetDate] = useState(() => localStorage.getItem('ip-lastReset') || new Date().toDateString());
  
  // Привычки и серии
  const [rituals, setRituals] = useState(() => {
    const saved = localStorage.getItem('ip-rituals');
    if (saved) return JSON.parse(saved);
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

  const [streaks, setStreaks] = useState(() => JSON.parse(localStorage.getItem('ip-streaks') || '{}'));

  // Задачи разных типов
  const [dailyTasks, setDailyTasks] = useState(() => JSON.parse(localStorage.getItem('ip-dailyTasks') || '[]'));
  const [weeklyGoals, setWeeklyGoals] = useState(() => JSON.parse(localStorage.getItem('ip-weeklyGoals') || '[]'));
  const [completedTasks, setCompletedTasks] = useState(() => JSON.parse(localStorage.getItem('ip-completedTasks') || '[]'));
  
  const [newTask, setNewTask] = useState('');
  const [taskPriority, setTaskPriority] = useState(1);
  const [taskType, setTaskType] = useState('daily');

  // Трекеры
  const [mood, setMood] = useState(() => parseInt(localStorage.getItem('ip-todayMood') || '5'));
  const [achievements, setAchievements] = useState(() => JSON.parse(localStorage.getItem('ip-achievements') || '[]'));
  const [rewards, setRewards] = useState(() => {
    const saved = localStorage.getItem('ip-rewards');
    if (saved) return JSON.parse(saved);
    return [
      { id: 1, name: 'Вкусный кофе', cost: 10, claimed: false, resetDays: 1 },
      { id: 2, name: 'Массаж/SPA', cost: 80, claimed: false, resetDays: 7 },
      { id: 3, name: 'Поход в кино', cost: 40, claimed: false, resetDays: 3 },
      { id: 4, name: 'Ужин в ресторане', cost: 60, claimed: false, resetDays: 7 },
      { id: 5, name: 'Новая вещь', cost: 70, claimed: false, resetDays: 14 },
      { id: 6, name: '2 часа ничего не делать', cost: 30, claimed: false, resetDays: 1 },
    ];
  });

  // Конфигурация привычек
  const ritualConfig = {
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

  const screens = [
    { name: 'Привычки', icon: Trophy },
    { name: 'Цели', icon: Target },
    { name: 'История', icon: Calendar },
    { name: 'Награды', icon: Gift },
    { name: 'Статистика', icon: BarChart3 }
  ];

  const maxPoints = 70;
  const weekProgress = Math.min((points / maxPoints) * 100, 100);

  // Вычисляем уровень
  const calculateLevel = (totalPts) => Math.floor(totalPts / 100) + 1;
  const getPointsForNextLevel = () => (level * 100) - totalPoints;

  // Сохранение в localStorage
  useEffect(() => { localStorage.setItem('ip-week', week.toString()); }, [week]);
  useEffect(() => { localStorage.setItem('ip-points', points.toString()); }, [points]);
  useEffect(() => { localStorage.setItem('ip-level', level.toString()); }, [level]);
  useEffect(() => { localStorage.setItem('ip-totalPoints', totalPoints.toString()); }, [totalPoints]);
  useEffect(() => { localStorage.setItem('ip-rituals', JSON.stringify(rituals)); }, [rituals]);
  useEffect(() => { localStorage.setItem('ip-streaks', JSON.stringify(streaks)); }, [streaks]);
  useEffect(() => { localStorage.setItem('ip-dailyTasks', JSON.stringify(dailyTasks)); }, [dailyTasks]);
  useEffect(() => { localStorage.setItem('ip-weeklyGoals', JSON.stringify(weeklyGoals)); }, [weeklyGoals]);
  useEffect(() => { localStorage.setItem('ip-completedTasks', JSON.stringify(completedTasks)); }, [completedTasks]);
  useEffect(() => { localStorage.setItem('ip-todayMood', mood.toString()); }, [mood]);
  useEffect(() => { localStorage.setItem('ip-achievements', JSON.stringify(achievements)); }, [achievements]);
  useEffect(() => { localStorage.setItem('ip-rewards', JSON.stringify(rewards)); }, [rewards]);
  useEffect(() => { localStorage.setItem('ip-lastReset', lastResetDate); }, [lastResetDate]);

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
  const updateStreak = useCallback((ritualKey, completed) => {
    const today = new Date().toDateString();
    setStreaks(prev => {
      const newStreaks = { ...prev };
      if (!newStreaks[ritualKey]) {
        newStreaks[ritualKey] = { count: 0, lastDate: null };
      }
      
      if (completed) {
        if (newStreaks[ritualKey].lastDate !== today) {
          newStreaks[ritualKey].count += 1;
          newStreaks[ritualKey].lastDate = today;
          
          const streakCount = newStreaks[ritualKey].count;
          if (streakCount === 7) addAchievement(`🔥 ${ritualConfig[ritualKey].name}: 7 дней подряд!`);
          if (streakCount === 30) addAchievement(`💎 ${ritualConfig[ritualKey].name}: месяц без перерыва!`);
        }
      } else {
        newStreaks[ritualKey].count = 0;
      }
      
      return newStreaks;
    });
  }, [addAchievement, ritualConfig]);

  const toggleRitual = useCallback((ritualKey) => {
    const ritual = ritualConfig[ritualKey];
    if (!ritual) return;

    setRituals(prevRituals => {
      const isCurrentlyActive = prevRituals[ritualKey];
      const newRituals = { ...prevRituals, [ritualKey]: !isCurrentlyActive };

      if (!isCurrentlyActive) {
        updatePoints(ritual.points);
        updateStreak(ritualKey, true);
      } else {
        setPoints(prev => Math.max(0, prev - ritual.points));
        updateStreak(ritualKey, false);
      }

      return newRituals;
    });
  }, [ritualConfig, updatePoints, updateStreak]);

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
    }
    
    setNewTask('');
  }, [newTask, taskPriority, taskType]);

  const toggleTask = useCallback((taskId, taskType) => {
    const toggleTaskInArray = (prevTasks) => {
      const taskIndex = prevTasks.findIndex(t => t.id === taskId);
      if (taskIndex === -1) return prevTasks;

      const task = prevTasks[taskIndex];
      const newTasks = [...prevTasks];

      if (!task.completed) {
        const completedTask = {
          ...task,
          completed: true,
          completedAt: new Date().toISOString(),
          taskType: taskType
        };
        
        setCompletedTasks(prev => [completedTask, ...prev]);
        updatePoints(task.priority);
        
        return newTasks.filter(t => t.id !== taskId);
      } else {
        newTasks[taskIndex] = { ...task, completed: false };
        setPoints(prev => Math.max(0, prev - task.priority));
        return newTasks;
      }
    };

    if (taskType === 'daily') {
      setDailyTasks(toggleTaskInArray);
    } else if (taskType === 'weekly') {
      setWeeklyGoals(toggleTaskInArray);
    }
  }, [updatePoints]);

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
      week, points, level, totalPoints, rituals, streaks, dailyTasks, weeklyGoals, 
      mood, achievements, exportDate: new Date().toISOString()
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
  }, [week, points, level, totalPoints, rituals, streaks, dailyTasks, weeklyGoals, mood, achievements, addAchievement]);

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

  // Сброс в новый день
  useEffect(() => {
    const checkNewDay = () => {
      const today = new Date().toDateString();
      if (today !== lastResetDate) {
        setRituals(prev => {
          const newRituals = { ...prev };
          Object.keys(ritualConfig).forEach(key => {
            if (ritualConfig[key].time !== 'weekend') {
              newRituals[key] = false;
            }
          });
          return newRituals;
        });

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
  }, [lastResetDate, week, ritualConfig, addAchievement]);

  // Компонент привычки
  const RitualCard = ({ ritualKey, ritual }) => {
    const IconComponent = ritual.icon;
    const isActive = rituals[ritualKey];
    const streak = streaks[ritualKey]?.count || 0;

    return (
      <div
        onClick={() => toggleRitual(ritualKey)}
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
            <IconComponent className={`w-6 h-6 ${isActive ? 'text-white' : ritual.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className={`font-medium text-base leading-tight mb-1 ${isActive ? 'text-white' : 'text-neutral-900'}`}>
              {ritual.name}
            </h4>
            <p className={`text-sm leading-relaxed mb-2 ${isActive ? 'text-neutral-300' : 'text-neutral-600'}`}>
              {ritual.desc}
            </p>
            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium ${isActive ? 'text-neutral-400' : 'text-neutral-500'}`}>
                {ritual.points} очков
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
            </div>

            <div className="bg-white rounded-3xl shadow-sm p-8 border border-neutral-100">
              <h3 className="text-2xl font-light text-neutral-900 mb-8">Ежедневные привычки</h3>
              
              <div className="mb-10">
                <h4 className="text-lg font-medium text-neutral-800 mb-6 flex items-center">
                  <span className="text-2xl mr-3">🌅</span>
                  Утренние привычки
                </h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {Object.entries(ritualConfig)
                    .filter(([_, ritual]) => ritual.time === 'morning')
                    .map(([key, ritual]) => (
                      <RitualCard key={key} ritualKey={key} ritual={ritual} />
                    ))}
                </div>
              </div>

              <div className="mb-10">
                <h4 className="text-lg font-medium text-neutral-800 mb-6 flex items-center">
                  <span className="text-2xl mr-3">⏰</span>
                  В течение дня
                </h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {Object.entries(ritualConfig)
                    .filter(([_, ritual]) => ritual.time === 'flexible' || ritual.time === 'all-day')
                    .map(([key, ritual]) => (
                      <RitualCard key={key} ritualKey={key} ritual={ritual} />
                    ))}
                </div>
              </div>

              <div className="mb-10">
                <h4 className="text-lg font-medium text-neutral-800 mb-6 flex items-center">
                  <span className="text-2xl mr-3">🌙</span>
                  Вечерние привычки
                </h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {Object.entries(ritualConfig)
                    .filter(([_, ritual]) => ritual.time === 'evening' || ritual.time === 'night')
                    .map(([key, ritual]) => (
                      <RitualCard key={key} ritualKey={key} ritual={ritual} />
                    ))}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium text-neutral-800 mb-6 flex items-center">
                  <span className="text-2xl mr-3">🏖️</span>
                  Недельные задачи
                </h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {Object.entries(ritualConfig)
                    .filter(([_, ritual]) => ritual.time === 'weekend')
                    .map(([key, ritual]) => (
                      <RitualCard key={key} ritualKey={key} ritual={ritual} />
                    ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 1: // Цели
        return (
          <div className="space-y-8">
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
                      className="p-4 rounded-xl cursor-pointer transition-all border bg-white border-neutral-200 hover:shadow-md hover:border-neutral-300"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-light text-neutral-900">{task.text}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded-full">
                            {task.priority} очк
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

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
                      className="p-4 rounded-xl cursor-pointer transition-all border border-l-4 border-l-blue-400 bg-white border-neutral-200 hover:shadow-md hover:border-neutral-300"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-light text-neutral-900">{task.text}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                            {task.priority} очк
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        );

      case 2: // История
        return (
          <div className="space-y-8">
            <div className="bg-white rounded-3xl shadow-sm p-8 border border-neutral-100">
              <h3 className="text-xl font-medium text-neutral-900 mb-6 flex items-center">
                <CheckCircle className="w-6 h-6 mr-3 text-green-500" />
                Архив выполненных задач
              </h3>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {completedTasks.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">📋</div>
                    <p className="text-neutral-500 font-light">Выполненных задач пока нет</p>
                  </div>
                ) : (
                  completedTasks.slice(0, 20).map(task => {
                    const completedDate = new Date(task.completedAt);
                    const dateStr = completedDate.toLocaleDateString('ru-RU');
                    const timeStr = completedDate.toLocaleTimeString('ru-RU', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    });
                    const taskTypeLabel = task.taskType === 'daily' ? 'День' : 'Неделя';
                    const taskTypeColor = task.taskType === 'daily' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600';
                    
                    return (
                      <div key={task.id} className="p-4 rounded-xl bg-green-50 border border-green-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-neutral-900 font-light mb-2">{task.text}</p>
                            <div className="flex items-center space-x-3 text-xs">
                              <span className={`px-2 py-1 rounded-full ${taskTypeColor}`}>
                                {taskTypeLabel}
                              </span>
                              <span className="text-neutral-500">{dateStr} в {timeStr}</span>
                            </div>
                          </div>
                          <div className="ml-4 flex-shrink-0">
                            <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                              +{task.priority}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        );

      case 3: // Награды
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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rewards.map(reward => {
                  const canClaim = points >= reward.cost && !reward.claimed;
                  return (
                    <div
                      key={reward.id}
                      onClick={() => canClaim && claimReward(reward.id)}
                      className={`p-6 rounded-2xl border transition-all ${
                        reward.claimed
                          ? 'bg-emerald-50 border-emerald-200'
                          : canClaim
                            ? 'bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-md cursor-pointer'
                            : 'bg-neutral-50 border-neutral-200 opacity-60'
                      }`}
                    >
                      <div className="text-center">
                        <div className="mb-4">
                          {reward.claimed ? (
                            <Award className="w-12 h-12 text-emerald-500 mx-auto" />
                          ) : (
                            <Gift className={`w-12 h-12 mx-auto ${canClaim ? 'text-neutral-700' : 'text-neutral-400'}`} />
                          )}
                        </div>
                        <h4 className="font-medium text-neutral-900 mb-2">{reward.name}</h4>
                        <p className={`font-light text-sm mb-2 ${
                          reward.claimed ? 'text-emerald-600' : 
                          canClaim ? 'text-neutral-600' : 'text-red-500'
                        }`}>
                          {reward.claimed ? 'Получено!' : 
                           canClaim ? `${reward.cost} очков` : 
                           `Нужно ${reward.cost} очков`}
                        </p>
                        {reward.claimed && (
                          <p className="text-xs text-neutral-500">
                            Доступно через {reward.resetDays} {reward.resetDays === 1 ? 'день' : 'дней'}
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

      case 4: // Статистика
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
                    { label: 'Выполнено привычек сегодня', value: `${Object.values(rituals).filter(Boolean).length}/20` },
                    { label: 'Активных целей', value: [...dailyTasks, ...weeklyGoals].length },
                    { label: 'Настроение сегодня', value: `${mood}/10` }
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center p-4 bg-neutral-50 rounded-xl">
                      <span className="text-neutral-700 font-light">{item.label}</span>
                      <span className="font-medium text-neutral-900">{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-neutral-800 mb-4 flex items-center">
                      <Flame className="w-5 h-5 mr-2 text-orange-500" />
                      Лучшие серии
                    </h4>
                    <div className="space-y-2">
                      {topStreaks.length === 0 ? (
                        <p className="text-neutral-500 font-light text-sm">Серий пока нет</p>
                      ) : (
                        topStreaks.map(([ritualKey, streak]) => (
                          <div key={ritualKey} className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                            <span className="text-sm text-neutral-700">{ritualConfig[ritualKey]?.name}</span>
                            <span className="text-sm font-medium text-orange-600">{streak.count} дней</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

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
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        
        <div className="text-center py-8 mb-12">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <InteractiveEye />
            <h1 className="text-4xl md:text-6xl font-extralight text-neutral-900 tracking-tight">i.p</h1>
          </div>
          <p className="text-neutral-600 font-light tracking-wide">Система личной эффективности</p>
        </div>

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

        <div className="mb-12">
          {renderScreen()}
        </div>

        <div className="text-center py-8">
          <div className="bg-gradient-to-r from-neutral-800 to-neutral-900 rounded-3xl shadow-sm p-8 text-center">
            <p className="text-white font-light text-lg tracking-wide mb-2">
              "Радуем себя не тогда, когда есть возможность и деньги,<br className="hidden md:block" /> а тогда, когда доделали важные дела"
            </p>
            <p className="text-neutral-400 font-light tracking-wide">— Система личной эффективности</p>
          </div>
        </div>
      </div>

      <HelpButton />
    </div>
  );
};

export default App;
