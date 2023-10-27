import React, { useState, useEffect } from "react";
import HabitForm from "./HabitForm";
import HabitList from "./HabitList";
import DeletedHabits from "./DeletedHabits";
import FavoriteHabits from "./FavoriteHabits";
import emailjs from "emailjs-com";
import CompletedHabits from "./CompletedHabits";
import CategoryDropdown from "./CategoryDropdown";
import RegistrationForm from "./RegistrationForm";
import Chart from "chart.js/auto";
import SkewedNavbar from "./SkewedNavbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const setThemePreference = (theme) => {
  localStorage.setItem("theme", theme);
};

const getThemePreference = () => {
  return localStorage.getItem("theme") || "light";
};

function App() {

  const initialHabits = JSON.parse(localStorage.getItem("habits")) || [];
  const initialCategories = JSON.parse(localStorage.getItem("categories")) || [];

  const [habits, setHabits] = useState(initialHabits);
  const [categories, setCategories] = useState(initialCategories);

  const [deletedHabits, setDeletedHabits] = useState([]);
  const [showDeletedHabits, setShowDeletedHabits] = useState(false);
  const [showFavoriteHabits, setShowFavoriteHabits] = useState(false);
  const [favoriteHabits, setFavoriteHabits] = useState([]);
  const [completedHabits, setCompletedHabits] = useState([]);
  const [showCompletedHabits, setShowCompletedHabits] = useState(false);
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [theme, setTheme] = useState(getThemePreference());
  const [isRegistrationVisible, setIsRegistrationVisible] = useState(false);
  const [completedHabitsData, setCompletedHabitsData] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedFrequency, setSelectedFrequency] = useState("none");

  // Load favorite habits from localStorage when the component mounts
  useEffect(() => {
    const storedFavoriteHabits = localStorage.getItem("favoriteHabits");
    let parsedFavoriteHabits = [];

    if (storedFavoriteHabits) {
      try {
        parsedFavoriteHabits = JSON.parse(storedFavoriteHabits);
      } catch (error) {
        console.error("Error parsing favorite habits JSON:", error);
      }
    }

    setFavoriteHabits(parsedFavoriteHabits);
  }, []);

  // Function to save favorite habits to local storage
  const saveFavoriteHabitsToStorage = (favoriteHabits) => {
    localStorage.setItem("favoriteHabits", JSON.stringify(favoriteHabits));
  };

  useEffect(() => {
    const storedCategories = localStorage.getItem("categories");
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    }
  }, []);

  const saveCompletedHabitsToStorage = (completedHabits) => {
    localStorage.setItem("completedHabits", JSON.stringify(completedHabits));
  };

  useEffect(() => {
    const storedCompletedHabits = localStorage.getItem("completedHabits");
    if (storedCompletedHabits) {
      setCompletedHabits(JSON.parse(storedCompletedHabits));
    }
  }, []);

  useEffect(() => {
    // When habits or categories change, save them to localStorage.
    localStorage.setItem("habits", JSON.stringify(habits));
    localStorage.setItem("categories", JSON.stringify(categories));
  }, [habits, categories]);


  const getDeletedHabitsFromStorage = () => {
    const deletedHabitsString = localStorage.getItem("deletedHabits");
    return deletedHabitsString ? JSON.parse(deletedHabitsString) : [];
  };

  // Load deleted habits from local storage when the component mounts
  useEffect(() => {
    const storedDeletedHabits = getDeletedHabitsFromStorage();
    setDeletedHabits(storedDeletedHabits);
  }, []);

  // Function to save deleted habits to local storage
  const saveDeletedHabitsToStorage = (deletedHabits) => {
    localStorage.setItem("deletedHabits", JSON.stringify(deletedHabits));
  };

  useEffect(() => {
    const data = {};
    completedHabits
      .filter(
        (habit) =>
          selectedCategory === "All" || habit.category === selectedCategory
      )
      .forEach((habit) => {
        if (habit.category) {
          if (!data[habit.category]) {
            data[habit.category] = 1;
          } else {
            data[habit.category] += 1;
          }
        }
      });
    setCompletedHabitsData(data);
  }, [completedHabits, selectedCategory, theme]);

  useEffect(() => {
    const showChart = (completedHabitsData) => {
      const canvas = document.getElementById("habitsChart");
      const ctx = canvas.getContext("2d");

      if (window.myChart) {
        window.myChart.destroy();
      }
      const tickColor = theme === "light" ? "black" : "white";
      window.myChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: Object.keys(completedHabitsData),
          datasets: [
            {
              label: "Completed Habits by Category",
              data: Object.values(completedHabitsData),
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(255, 159, 64, 0.2)",
              ],

              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          plugins: {
            legend: {
              labels: {
                color: tickColor,
              },
            },
          },
          scales: {
            x: {
              beginAtZero: true,
              ticks: {
                color: tickColor,
              },
            },
            y: {
              beginAtZero: true,
              stepSize: 1,
              ticks: {
                color: tickColor,
              },
            },
          },
        },
      });
    };

    if (completedHabitsData) {
      showChart(completedHabitsData);
    }
  }, [completedHabitsData, theme]);

    const addHabit = (habit) => {
    const timestamp = new Date().getTime();
    habit.key = timestamp;
    habit.initialGoalDays = habit.goalDays;
    habit.date = new Date();

    habit.goalDays = habit.initialGoalDays;

    setHabits((prevHabits) => [...prevHabits, habit]);

    setCategories((prevCategories) => {
      const uniqueCategories = Array.from(
        new Set([...prevCategories, habit.category])
      );
      return [...uniqueCategories];
    });

    setSelectedCategory(habit.category);

    const reminderTime = habit.reminderTime;
    if (reminderTime) {
      const [hours, minutes] = reminderTime.split(":");
      const currentDate = new Date();
      const reminderDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        hours,
        minutes
      );

      if (reminderDate > currentDate) {
        const timeUntilReminder = reminderDate - currentDate;
        setTimeout(() => {
          sendReminderEmail(habit.name);
        }, timeUntilReminder);
      }
    }
    setSelectedDate(new Date());
    setSelectedFrequency("none");
  };

  const sendReminderEmail = (habitName) => {
    const templateParams = {
      to_email: "zenikibeniki@gmail.com",
      subject: "Reminder: Complete Your Habit",
      message: `Don't forget to complete your habit: ${habitName}`,
    };

    emailjs
      .send(
        "service_1n4gsgx",
        "template_mgjx1fd",
        templateParams,
        "u4-0CXt6mlWQViI6d"
      )
      .then((response) => {
        console.log("Email sent:", response);
      })
      .catch((error) => {
        console.error("Email error:", error);
      });
  };

  const updateHabit = (index, updatedHabit) => {
    const updatedHabits = [...habits];
    updatedHabits[index] = updatedHabit;
    setHabits(updatedHabits);
  };

  const deleteHabit = (index) => {
    const deletedHabit = habits[index];
    const updatedHabits = habits.filter((_, i) => i !== index);
    setHabits(updatedHabits);
    setDeletedHabits([...deletedHabits, deletedHabit]);
    saveDeletedHabitsToStorage([...deletedHabits, deletedHabit]);

    if (favoriteHabits.includes(deletedHabit)) {
      const updatedFavoriteHabits = favoriteHabits.filter(
        (habit) => habit !== deletedHabit
      );
      setFavoriteHabits(updatedFavoriteHabits);
    }
  };

  const toggleDeletedHabits = () => {
    setShowDeletedHabits(!showDeletedHabits);
  };

  const makeFavoriteHabit = (index) => {
    const habitToFavorite = habits[index];
    let updatedFavoriteHabits;

    if (!favoriteHabits.includes(habitToFavorite)) {
      updatedFavoriteHabits = [...favoriteHabits, habitToFavorite];
    } else {
      updatedFavoriteHabits = favoriteHabits.filter(
        (habit) => habit !== habitToFavorite
      );
    }

    setFavoriteHabits(updatedFavoriteHabits);
    // Save updated favorite habits to localStorage
    saveFavoriteHabitsToStorage(updatedFavoriteHabits);
  };

  const toggleCategoriesDropdown = () => {
    setShowCategoriesDropdown(!showCategoriesDropdown);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    toggleCategoriesDropdown(false);
  };

  const handleDeleteCategory = (categoryToDelete) => {
    const updatedCategories = categories.filter(
      (category) => category !== categoryToDelete
    );
    setCategories(updatedCategories);
    localStorage.setItem("categories", JSON.stringify(updatedCategories));
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    setThemePreference(newTheme); // Save the theme preference
  };

  const completeHabit = (index) => {
    const completedHabit = habits[index];
    if (completedHabit.goalDays > 0) {
      const updatedGoalDays = completedHabit.goalDays - 1;
      const updatedHabit = { ...completedHabit, goalDays: updatedGoalDays };
      updateHabit(index, updatedHabit);

      if (updatedGoalDays === 0) {
        // Update completedHabits directly
        setCompletedHabits([...completedHabits, updatedHabit]);
        // Save completed habits to localStorage
        saveCompletedHabitsToStorage([...completedHabits, updatedHabit]);
      }
    }
  };

  const toggleRegistration = () => {
    setIsRegistrationVisible(!isRegistrationVisible);
  };

  const createCategory = (newCategory) => {
    if (!categories.includes(newCategory)) {
      setCategories((prevCategories) => [...prevCategories, newCategory]);
    }
  };

  return (
    <div className={`app-container ${theme}`}>
      <div
        className='animation-container'
        dangerouslySetInnerHTML={{
          __html: `
      
        <svg
          version='1.1'
          xmlns='http://www.w3.org/2000/svg'
          xmlns:xlink='http://www.w3.org/1999/xlink'
          x='0px'
          y='0px'
          width='100%'
          height='100%'
          viewBox='0 0 1600 900'
        >
          <defs>
            <linearGradient id='bg' x2='0%' y2='100%'>
              <stop
                offset='0%'
                style='stop-color: rgba(119, 119, 119, 1)'
              ></stop>
              <stop
                offset='100%'
                style='stop-color: rgba(153, 153, 153, 1)'
              ></stop>
            </linearGradient>
            <path
              id='wave'
              fill='url(#bg)'
              d='M-363.852,502.589c0,0,236.988-41.997,505.475,0
      s371.981,38.998,575.971,0s293.985-39.278,505.474,5.859s493.475,48.368,716.963-4.995v560.106H-363.852V502.589z'
            />
          </defs>
          <g>
            <use xlink:href='#wave' opacity='.3'>
              <animateTransform
                attributeName='transform'
                attributeType='XML'
                type='translate'
                dur='8s'
                calcMode='spline'
                values='270 230; -334 180; 270 230'
                keyTimes='0; .5; 1'
                keySplines='0.42, 0, 0.58, 1.0;0.42, 0, 0.58, 1.0'
                repeatCount='indefinite'
              />
            </use>
            <use xlink:href='#wave' opacity='.6'>
              <animateTransform
                attributeName='transform'
                attributeType='XML'
                type='translate'
                dur='6s'
                calcMode='spline'
                values='-270 230;243 220;-270 230'
                keyTimes='0; .6; 1'
                keySplines='0.42, 0, 0.58, 1.0;0.42, 0, 0.58, 1.0'
                repeatCount='indefinite'
              />
            </use>
            <use xlink:href='#wave' opacty='.9'>
              <animateTransform
                attributeName='transform'
                attributeType='XML'
                type='translate'
                dur='4s'
                calcMode='spline'
                values='0 230;-140 200;0 230'
                keyTimes='0; .4; 1'
                keySplines='0.42, 0, 0.58, 1.0;0.42, 0, 0.58, 1.0'
                repeatCount='indefinite'
              />
            </use>
          </g>
        </svg>
      
      `,
        }}
      ></div>
      <SkewedNavbar
        onDeleteClick={() => setShowDeletedHabits(!showDeletedHabits)}
        onFavoriteClick={() => setShowFavoriteHabits(!showFavoriteHabits)}
        onCompletedClick={() => setShowCompletedHabits(!showCompletedHabits)}
        onCategoriesClick={toggleCategoriesDropdown}
        onThemeClick={toggleTheme}
        onRegisterClick={toggleRegistration}
      />
      {showCategoriesDropdown && (
        <CategoryDropdown
          onDeleteCategory={handleDeleteCategory}
          showCategoriesDropdown={showCategoriesDropdown}
          onCategorySelect={handleCategorySelect}
          onCreateCategory={createCategory}
          categories={categories}
        />
      )}
      <div className='chart-container'>
        <canvas id='habitsChart'></canvas>
      </div>
      {isRegistrationVisible && (
        <RegistrationForm onClose={toggleRegistration} />
      )}
      <h1>Habit Tracker</h1>
      <HabitForm
        addHabit={addHabit}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        setSelectedFrequency={setSelectedFrequency}
        selectedFrequency={selectedFrequency}
      />
      <HabitList
        habits={habits}
        favoriteHabits={favoriteHabits}
        updateHabit={updateHabit}
        deleteHabit={deleteHabit}
        makeFavoriteHabit={makeFavoriteHabit}
        setCompletedHabits={setCompletedHabits}
        selectedCategory={selectedCategory}
        completeHabit={completeHabit}
        setHabits={setHabits}
        completedHabits={completedHabits}
      />
      <ToastContainer />
      {showDeletedHabits && (
        <DeletedHabits
          deletedHabits={deletedHabits}
          onClose={toggleDeletedHabits}
        />
      )}
      {showFavoriteHabits && (
        <FavoriteHabits
          favoriteHabits={favoriteHabits}
          setShowFavoriteHabits={setShowFavoriteHabits}
        />
      )}
      {showCompletedHabits && (
        <CompletedHabits
          completedHabits={completedHabits}
          onClose={() => setShowCompletedHabits(false)}
        />
      )}
    </div>
  );
}

export default App;
