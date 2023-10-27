Step 1: Initialize Habits and Categories
from Local Storage.

- In you App.js define initial states for
habits and categories using useState.

Step 2: Sync goalDays with initialGoalDays.

- When you add a habit, set the goalDays to
match initialGoalDays.

Step 3: Add a Button to Toggle
Unfinished Habits.

- In you HabitList.js define a state variable
showUnfinished to control whether unfinished
habits are displayed.
- Create a function to handle the button
click event.

Step 4: Filter Habits Based on Completion Status.

- Modify filteredHabits based on the showCompletedHabits
state.If showCompletedHabits is true, it displays
habits that are in the completedHabits array.
If showCompletedHabits is false, it displays
habits that are not in the completedHabits array.

Step 5: Load showUnfinished State from
Local Storage.

- Check if there are unfinished habits in useEffect
in HabitList.js and set the state accordingly.

Step 6: Add the Button to Toggle Unfinished
Habits in Your Component.

- Add a button to your component that calls
the handleToggleUnfinished function.

 
