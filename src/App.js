import React, { useState, useEffect, useCallback } from 'react';
import { Star, Trophy, Target, Calendar, Zap, CheckCircle, Plus, BarChart3, Clock, BookOpen, Dumbbell, Droplets, Coffee, Bed, Brain, Heart, Gift, Award, Eye, ChevronLeft, ChevronRight, RotateCcw, HelpCircle, X } from 'lucide-react';

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
      {/* Ненавязчивая кнопка справки */}
      <button
        onClick={() => setShowHelp(true)}
        className="fixed bottom-6 right-6 w-10 h-10 bg-white border border-neutral-300 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all opacity-60 hover:opacity-100 z-40"
        title="Информация о приватности и использовании"
      >
        <HelpCircle className="w-5 h-5 text-neutral-600" />
      </button>

      {/* Модальное окно с информацией */}
      {showHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50" onClick={() => setShowHelp(false)}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              {/* Заголовок */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-medium text-neutral-900">О системе i.p</h2>
                <button
                  onClick={() => setShowHelp(false)}
                  className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-neutral-600" />
                </button>
              </div>

              {/* Приватность */}
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

              {/* Как пользоваться */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-neutral-800 mb-3 flex items-center">
                  <span className="text-xl mr-2">📖</span>
                  Как пользоваться
                </h3>
                <div className="space-y-3 text-sm text-neutral-600 font-light">
                  <div>
                    <p className="font-medium text-neutral-800 mb-1">Ритуалы</p>
                    <p>Нажимайте на карточки для отметки выполнения. Каждый ритуал дает очки.</p>
                  </div>
                  <div>
                    <p className="font-medium text-neutral-800 mb-1">Задачи</p>
                    <p>Добавляйте дневные задачи с приоритетом 1-3 очка.</p>
                  </div>
                  <div>
                    <p className="font-medium text-neutral-800 mb-1">Награды</p>
                    <p>Тратьте накопленные очки на приятные вещи.</p>
                  </div>
                  <div>
                    <p className="font-medium text-neutral-800 mb-1">Навигация</p>
                    <p>Используйте стрелки ← → или свайпы между экранами.</p>
                  </div>
                </div>
              </div>

              {/* Принцип */}
              <div className="mb-4">
                <div className="bg-neutral-50 rounded-xl p-4 text-center">
                  <p className="text-sm text-neutral-700 font-light italic leading-relaxed">
                    "Радуем себя не тогда, когда есть возможность и деньги, 
                    а тогда, когда доделали важные дела"
                  </p>
                </div>
              </div>

              {/* Кнопка закрытия */}
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
  // Основное состояние
  const [currentScreen, setCurrentScreen] = useState(0);
  const [week, setWeek] = useState(() => parseInt(localStorage.getItem('ip-week') || '1'));
  const [points, setPoints] = useState(() => parseInt(localStorage.getItem('ip-points') || '0'));
  const [lastResetDate, setLastResetDate] = useState(() => localStorage.getItem('ip-lastReset') || new Date().toDateString());
  
  // Ритуалы
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

  // Задачи и прочее
  const [tasks, setTasks] = useState(() => JSON.parse(localStorage.getItem('ip-tasks') || '[]'));
  const [newTask, setNewTask] = useState('');
  const [taskPriority, setTaskPriority] = useState(1);
  const [achievements, setAchievements] = useState(() => JSON.parse(localStorage.getItem('ip-achievements') || '[]'));
  const [weekPlan, setWeekPlan] = useState(() => JSON.parse(localStorage.getItem('ip-weekPlan') || '{}'));
  const [rewards, setRewards] = useState(() => {
    const saved = localStorage.getItem('ip-rewards');
    if (saved) return JSON.parse(saved);
    return [
      { id: 1, name: 'Вкусный кофе', cost: 10, claimed: false },
      { id: 2, name: 'Массаж/SPA', cost: 80, claimed: false },
      { id: 3, name: 'Поход в кино', cost: 40, claimed: false },
      { id: 4, name: 'Ужин в ресторане', cost: 60, claimed: false },
      { id: 5, name: 'Новая вещь', cost: 70, claimed: false },
      { id: 6, name: 'Ничего не делать', cost: 30, claimed: false },
      { id: 7, name: 'Поесть вредное', cost: 35, claimed: false },
      { id: 8, name: 'Сходить на свидание', cost: 50, claimed: false },
    ];
  });

  // Конфигурация ритуалов
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

  const financialBonuses = [
    { id: 1, name: 'Получил доход', points: 100, desc: 'Любой заработок' },
    { id: 2, name: 'Крупная сделка', points: 200, desc: 'Большая сумма' },
    { id: 3, name: 'Инвестиция окупилась', points: 150, desc: 'Прибыль от инвестиций' },
  ];

  const screens = [
    { name: 'Ритуалы', icon: Trophy },
    { name: 'Планирование', icon: Calendar },  
    { name: 'Награды', icon: Gift },
    { name: 'Статистика', icon: BarChart3 }
  ];

  const maxPoints = 70;
  const weekProgress = Math.min((points / maxPoints) * 100, 100);

  // Вычисляем время до сброса
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

  // Сохранение в localStorage
  useEffect(() => { localStorage.setItem('ip-week', week.toString()); }, [week]);
  useEffect(() => { localStorage.setItem('ip-points', points.toString()); }, [points]);
  useEffect(() => { localStorage.setItem('ip-rituals', JSON.stringify(rituals)); }, [rituals]);
  useEffect(() => { localStorage.setItem('ip-tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('ip-achievements', JSON.stringify(achievements)); }, [achievements]);
  useEffect(() => { localStorage.setItem('ip-weekPlan', JSON.stringify(weekPlan)); }, [weekPlan]);
  useEffect(() => { localStorage.setItem('ip-rewards', JSON.stringify(rewards)); }, [rewards]);
  useEffect(() => { localStorage.setItem('ip-lastReset', lastResetDate); }, [lastResetDate]);

  // Добавление достижения
  const addAchievement = useCallback((text) => {
    const newAchievement = { 
      id: Date.now(), 
      text, 
      time: new Date().toLocaleTimeString() 
    };
    setAchievements(prev => [...prev, newAchievement]);
  }, []);

  // Логика ритуалов
  const toggleRitual = useCallback((ritualKey) => {
    const ritual = ritualConfig[ritualKey];
    if (!ritual) return;

    setRituals(prevRituals => {
      const isCurrentlyActive = prevRituals[ritualKey];
      const newRituals = { ...prevRituals, [ritualKey]: !isCurrentlyActive };

      // Обновляем очки
      if (!isCurrentlyActive) {
        // Добавляем очки
        setPoints(prevPoints => {
          const newPoints = prevPoints + ritual.points;
          console.log(`${ritual.name}: +${ritual.points} очков (всего: ${newPoints})`);
          return newPoints;
        });

        // Проверяем достижения за ритуалы
        const completedCount = Object.values(newRituals).filter(Boolean).length;
        if (completedCount === 5) addAchievement('🌟 5 ритуалов выполнено!');
        if (completedCount === 10) addAchievement('🔥 10 ритуалов за день!');
        if (completedCount === 15) addAchievement('💎 15 ритуалов - отлично!');
        if (completedCount === 20) addAchievement('🏆 Все ритуалы выполнены!');
      } else {
        // Убираем очки
        setPoints(prevPoints => Math.max(0, prevPoints - ritual.points));
      }

      return newRituals;
    });
  }, [ritualConfig, addAchievement]);

  // Логика задач
  const addTask = useCallback(() => {
    if (!newTask.trim()) return;
    
    const task = {
      id: Date.now(),
      text: newTask.trim(),
      priority: taskPriority,
      completed: false
    };
    
    setTasks(prev => [...prev, task]);
    setNewTask('');
  }, [newTask, taskPriority]);

  const toggleTask = useCallback((taskId) => {
    setTasks(prevTasks => {
      const taskIndex = prevTasks.findIndex(t => t.id === taskId);
      if (taskIndex === -1) return prevTasks;

      const task = prevTasks[taskIndex];
      const newTasks = [...prevTasks];
      newTasks[taskIndex] = { ...task, completed: !task.completed };

      // Обновляем очки
      if (!task.completed) {
        setPoints(prevPoints => prevPoints + task.priority);
        
        // Проверяем достижения за задачи
        const completedCount = newTasks.filter(t => t.completed).length;
        if (completedCount === 5) addAchievement('📋 5 задач выполнено!');
        if (completedCount === 10) addAchievement('💪 10 задач выполнено!');
        if (completedCount === 15) addAchievement('🚀 15 задач - продуктивно!');
      } else {
        setPoints(prevPoints => Math.max(0, prevPoints - task.priority));
      }

      return newTasks;
    });
  }, [addAchievement]);

  // Награды
  const claimReward = useCallback((rewardId) => {
    setRewards(prevRewards => {
      const rewardIndex = prevRewards.findIndex(r => r.id === rewardId);
      if (rewardIndex === -1) return prevRewards;

      const reward = prevRewards[rewardIndex];
      if (points < reward.cost || reward.claimed) return prevRewards;

      setPoints(prevPoints => prevPoints - reward.cost);
      addAchievement(`🎁 Награда: ${reward.name}!`);

      const newRewards = [...prevRewards];
      newRewards[rewardIndex] = { ...reward, claimed: true };

      // Сбрасываем через неделю
      setTimeout(() => {
        setRewards(prev => prev.map(r => 
          r.id === rewardId ? { ...r, claimed: false } : r
        ));
      }, 7 * 24 * 60 * 60 * 1000);

      return newRewards;
    });
  }, [points, addAchievement]);

  // Финансовые бонусы
  const addFinancialBonus = useCallback((bonusId) => {
    const bonus = financialBonuses.find(b => b.id === bonusId);
    if (!bonus) return;

    setPoints(prevPoints => prevPoints + bonus.points);
    addAchievement(`💰 ${bonus.name}: +${bonus.points} очков!`);
  }, [addAchievement]);

  // Навигация по экранам
  const changeScreen = useCallback((direction) => {
    setCurrentScreen(prev => {
      if (direction === 'next') {
        return prev >= screens.length - 1 ? 0 : prev + 1;
      } else {
        return prev <= 0 ? screens.length - 1 : prev - 1;
      }
    });
  }, [screens.length]);

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

  // Проверка достижений по очкам
  useEffect(() => {
    const pointMilestones = [
      { points: 50, text: '🎯 50 очков набрано!' },
      { points: 100, text: '💯 100 очков достигнуто!' },
      { points: 200, text: '🏅 200 очков - отличная неделя!' }
    ];

    pointMilestones.forEach(milestone => {
      if (points >= milestone.points && 
          !achievements.some(a => a.text === milestone.text)) {
        addAchievement(milestone.text);
      }
    });

    if (weekProgress >= 100 && 
        !achievements.some(a => a.text.includes('неделя завершена'))) {
      addAchievement('🎊 Неделя успешно завершена!');
    }
  }, [points, weekProgress, achievements, addAchievement]);

  // Сброс в новый день
  useEffect(() => {
    const checkNewDay = () => {
      const today = new Date().toDateString();
      if (today !== lastResetDate) {
        // Сбрасываем ежедневные ритуалы
        setRituals(prev => {
          const newRituals = { ...prev };
          Object.keys(ritualConfig).forEach(key => {
            if (ritualConfig[key].time !== 'weekend') {
              newRituals[key] = false;
            }
          });
          return newRituals;
        });

        setLastResetDate(today);
        
        // Проверяем новую неделю
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

  // Компонент ритуала
  const RitualCard = ({ ritualKey, ritual }) => {
    const IconComponent = ritual.icon;
    const isActive = rituals[ritualKey];

    return (
      <div
        onClick={() => toggleRitual(ritualKey)}
        className={`group relative p-5 rounded-2xl cursor-pointer transition-all duration-300 border ${
          isActive 
            ? 'bg-neutral-900 text-white border-neutral-800 shadow-xl' 
            : 'bg-white border-neutral-200 hover:border-neutral-300 shadow-sm hover:shadow-md'
        }`}
      >
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

  // Рендер экранов
  const renderScreen = () => {
    switch (currentScreen) {
      case 0: // Ритуалы
        return (
          <div className="space-y-8">
            {/* Прогресс недели */}
            <div className="bg-white rounded-3xl shadow-sm p-8 border border-neutral-100">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-2xl flex items-center justify-center text-white font-light text-2xl">
                    {week}
                  </div>
                  <div>
                    <h2 className="text-3xl font-light text-neutral-900">Неделя {week}</h2>
                    <p className="text-neutral-600 font-light">{points} очков накоплено</p>
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
                <p className="text-xs text-neutral-500 mt-2 font-light">
                  Ритуалы сбрасываются ежедневно в 00:00
                </p>
              </div>
            </div>

            {/* Ритуалы */}
            <div className="bg-white rounded-3xl shadow-sm p-8 border border-neutral-100">
              <h3 className="text-2xl font-light text-neutral-900 mb-8">Ежедневные ритуалы</h3>
              
              {/* Утренние */}
              <div className="mb-10">
                <h4 className="text-lg font-medium text-neutral-800 mb-6 flex items-center">
                  <span className="text-2xl mr-3">🌅</span>
                  Утренние ритуалы
                </h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {Object.entries(ritualConfig)
                    .filter(([_, ritual]) => ritual.time === 'morning')
                    .map(([key, ritual]) => (
                      <RitualCard key={key} ritualKey={key} ritual={ritual} />
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
                  {Object.entries(ritualConfig)
                    .filter(([_, ritual]) => ritual.time === 'flexible' || ritual.time === 'all-day')
                    .map(([key, ritual]) => (
                      <RitualCard key={key} ritualKey={key} ritual={ritual} />
                    ))}
                </div>
              </div>

              {/* Вечерние */}
              <div className="mb-10">
                <h4 className="text-lg font-medium text-neutral-800 mb-6 flex items-center">
                  <span className="text-2xl mr-3">🌙</span>
                  Вечерние ритуалы
                </h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {Object.entries(ritualConfig)
                    .filter(([_, ritual]) => ritual.time === 'evening' || ritual.time === 'night')
                    .map(([key, ritual]) => (
                      <RitualCard key={key} ritualKey={key} ritual={ritual} />
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
                  {Object.entries(ritualConfig)
                    .filter(([_, ritual]) => ritual.time === 'weekend')
                    .map(([key, ritual]) => (
                      <RitualCard key={key} ritualKey={key} ritual={ritual} />
                    ))}
                </div>
              </div>
            </div>

            {/* Задачи дня */}
            <div className="bg-white rounded-3xl shadow-sm p-8 border border-neutral-100">
              <h3 className="text-2xl font-light text-neutral-900 mb-8">Задачи дня</h3>
              
              <div className="flex flex-col lg:flex-row gap-4 mb-8">
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Добавить новую задачу..."
                  className="flex-1 p-4 border border-neutral-200 rounded-2xl focus:border-neutral-400 focus:outline-none text-base font-light placeholder-neutral-400"
                  onKeyPress={(e) => e.key === 'Enter' && addTask()}
                />
                <div className="flex gap-3">
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(Number(e.target.value))}
                    className="p-4 border border-neutral-200 rounded-2xl focus:border-neutral-400 focus:outline-none text-base font-light"
                  >
                    <option value={1}>1 очко</option>
                    <option value={2}>2 очка</option>
                    <option value={3}>3 очка</option>
                  </select>
                  <button
                    onClick={addTask}
                    className="bg-neutral-900 text-white p-4 rounded-2xl hover:bg-neutral-800 transition-colors"
                  >
                    <Plus className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {tasks.map(task => (
                  <div
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className={`p-5 rounded-2xl cursor-pointer transition-all border ${
                      task.completed
                        ? 'bg-neutral-50 border-neutral-200 opacity-60'
                        : 'bg-white border-neutral-200 hover:shadow-md hover:border-neutral-300'
                    } ${
                      task.priority === 1 ? 'border-l-4 border-l-emerald-400' :
                      task.priority === 2 ? 'border-l-4 border-l-amber-400' : 'border-l-4 border-l-red-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-light ${task.completed ? 'line-through text-neutral-500' : 'text-neutral-900'}`}>
                        {task.text}
                      </span>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm bg-neutral-100 text-neutral-600 px-3 py-1 rounded-full font-medium">
                          {task.priority} очк
                        </span>
                        {task.completed && <CheckCircle className="w-5 h-5 text-emerald-500" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 1: // Планирование
        const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
        const hours = Array.from({ length: 16 }, (_, i) => i + 6);

        return (
          <div className="bg-white rounded-3xl shadow-sm p-8 border border-neutral-100">
            <h3 className="text-2xl font-light text-neutral-900 mb-8">Планирование недели</h3>
            
            <div className="overflow-x-auto">
              <div className="min-w-full" style={{ minWidth: '700px' }}>
                <div className="grid grid-cols-8 gap-2 mb-4">
                  <div className="p-3 text-center font-medium text-neutral-700">Время</div>
                  {days.map(day => (
                    <div key={day} className="p-3 text-center font-medium text-neutral-700 bg-neutral-50 rounded-xl">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {hours.map(hour => (
                    <div key={hour} className="grid grid-cols-8 gap-2">
                      <div className="p-3 text-center font-medium text-neutral-600 bg-neutral-50 rounded-xl min-h-[80px] flex items-center justify-center">
                        {hour}:00
                      </div>
                      {days.map((day, dayIndex) => {
                        const key = `${dayIndex}-${hour}`;
                        return (
                          <textarea
                            key={key}
                            value={weekPlan[key] || ''}
                            onChange={(e) => setWeekPlan(prev => ({ ...prev, [key]: e.target.value }))}
                            placeholder="..."
                            className="p-3 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-400 min-h-[80px] resize-none font-light placeholder-neutral-400"
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 2: // Награды
        return (
          <div className="space-y-8">
            {/* Финансовые бонусы */}
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-3xl p-8 text-white">
              <h3 className="text-2xl font-light mb-2">Финансовые достижения</h3>
              <p className="text-emerald-100 font-light mb-8">Отмечайте доходы и инвестиционные успехи</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {financialBonuses.map(bonus => (
                  <button
                    key={bonus.id}
                    onClick={() => addFinancialBonus(bonus.id)}
                    className="bg-white bg-opacity-10 border border-white border-opacity-20 rounded-2xl p-6 text-left hover:bg-opacity-20 transition-all backdrop-blur-sm"
                  >
                    <h4 className="font-medium text-lg mb-1">{bonus.name}</h4>
                    <p className="text-emerald-100 text-sm font-light mb-3">{bonus.desc}</p>
                    <p className="text-white font-medium">+{bonus.points} очков</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Награды */}
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
                        <h4 className="font-medium text-neutral-900 mb-3">{reward.name}</h4>
                        <p className={`font-light ${
                          reward.claimed ? 'text-emerald-600' : 
                          canClaim ? 'text-neutral-600' : 'text-red-500'
                        }`}>
                          {reward.claimed ? 'Получено!' : 
                           canClaim ? `${reward.cost} очков` : 
                           `Нужно ${reward.cost} очков`}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 3: // Статистика
        return (
          <div className="space-y-8">
            <div className="bg-white rounded-3xl shadow-sm p-8 border border-neutral-100">
              <h3 className="text-2xl font-light text-neutral-900 mb-8">Статистика и достижения</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="font-medium text-neutral-800 mb-6">Текущие показатели</h4>
                  {[
                    { label: 'Очки накоплено', value: points },
                    { label: 'Текущая неделя', value: week },
                    { label: 'Выполнено ритуалов сегодня', value: `${Object.values(rituals).filter(Boolean).length}/20` },
                    { label: 'Выполнено задач', value: tasks.filter(t => t.completed).length },
                    { label: 'Прогресс недели', value: `${Math.round(weekProgress)}%` }
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center p-4 bg-neutral-50 rounded-xl">
                      <span className="text-neutral-700 font-light">{item.label}</span>
                      <span className="font-medium text-neutral-900">{item.value}</span>
                    </div>
                  ))}
                </div>

                <div>
                  <h4 className="font-medium text-neutral-800 mb-6">Последние достижения</h4>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {achievements.length === 0 ? (
                      <p className="text-neutral-500 font-light">Достижений пока нет</p>
                    ) : (
                      achievements.slice(-8).reverse().map(achievement => (
                        <div key={achievement.id} className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                          <p className="font-medium text-neutral-800">{achievement.text}</p>
                          <p className="text-xs text-neutral-500 font-light mt-1">{achievement.time}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Информация о сбросе */}
            <div className="bg-neutral-50 rounded-3xl p-8 border border-neutral-200">
              <h4 className="font-medium text-neutral-800 mb-4 flex items-center">
                <RotateCcw className="w-5 h-5 mr-2" />
                Как работает сброс состояния
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm font-light text-neutral-600">
                <div>
                  <h5 className="font-medium text-neutral-800 mb-2">Ежедневный сброс (00:00)</h5>
                  <ul className="space-y-1">
                    <li>• Все ежедневные ритуалы сбрасываются</li>
                    <li>• Задачи остаются до ручного удаления</li>
                    <li>• Очки сохраняются</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-neutral-800 mb-2">Недельные задачи</h5>
                  <ul className="space-y-1">
                    <li>• Сбрасываются только по понедельникам</li>
                    <li>• "4 часа на улице" и "Итоги недели"</li>
                    <li>• Помогают завершить недельный прогресс</li>
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

          <div className="flex space-x-2">
            {screens.map((screen, index) => {
              const IconComponent = screen.icon;
              return (
                <button
                  key={index}
                  onClick={() => setCurrentScreen(index)}
                  className={`flex items-center space-x-3 px-6 py-3 rounded-2xl font-light transition-all ${
                    currentScreen === index
                      ? 'bg-neutral-900 text-white shadow-md'
                      : 'bg-white text-neutral-600 hover:bg-neutral-50 shadow-sm border border-neutral-100'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="hidden sm:block tracking-wide">{screen.name}</span>
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
