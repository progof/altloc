<script setup lang="ts">
import { RouterLink } from "vue-router";
import GroupIcon from "@/assets/icons/GroupIcon.svg?component";
import NotesIcon from "@/assets/icons/CreateNoteIcon.svg?component";
import EventsIcon from "@/assets/icons/JoinEventsIcon.svg?component";
import ThoughtsIcon from "@/assets/icons/ThoughtsIcon.svg?component";
</script>

<template>

  <main class="main">
    <div class="wrapper">
      <div class="intro__wrapper">
        <div class="intro__box">
          <h1 class="intro__title">
            The perfect platform for creating a circle of interest
          </h1>

          <p class="intro__subtitle">
            Alteranium connects students to each other to create an atmosphere
            where it is easy to learn and create projects
          </p>

          <div class="intro__btn">
            <div class="wrapper__join">
              <RouterLink to="/register" class="intro__submit"
                >Join now</RouterLink
              >
            </div>
            <div class="wrapper__login">
              <RouterLink to="/login" class="intro__submit">Login</RouterLink>
            </div>
          </div>
        </div>

        <div class="intro__logo">
          <a href="/">
            <img
              src="../assets/object.svg"
              alt="The perfect platform for creating a circle of interest"
              style="width: 250px; height: 250px"
            />
          </a>
        </div>
      </div>
      <div class="intro__wrapper">
        <div class="box">
          <h2 style="color: aliceblue; font-size: 36px; margin-bottom: 50px">
            What can you do on the platform?
          </h2>

          <div class="item__wrapper">
            <div class="item">
              <GroupIcon class="icon" />
              <span style="margin-top: 20px"
                >Join a special interest group (space).</span
              >
            </div>
            <div class="item">
              <NotesIcon class="icon" />

              <span style="margin-top: 20px">Create notes for the group</span>
            </div>
            <div class="item">
              <EventsIcon class="icon" />
              <span style="margin-top: 20px"
                >Participate in activities to integrate with other group
                members</span
              >
            </div>
            <div class="item">
              <ThoughtsIcon class="icon" />
              <span style="margin-top: 20px"
                >Sharing his thoughts on his wall</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
/* Styles for the page container */
.intro__wrapper {
  display: flex;
  flex-direction: row; /* Changed to column for mobile devices */
  align-items: center;
  padding: 10% 5%; /* Adjusted padding for responsiveness */
  margin-right: 20px;
  justify-content: space-around;
  padding-right: 40px;
  padding-top: 10%;
}

.wrapper {
  max-width: 1200px;
  width: 100%; /* Modified for responsiveness */
  margin: 0 auto;
}

.intro__logo {
  margin-left: 5vw; /* Used relative unit vw for responsiveness */
}

/* Styles for the title */
.intro__title {
  max-width: 90%; /* Modified for responsiveness */
  margin-bottom: 2rem; /* Modified for responsiveness */
}

/* Styles for the subtitle */
.intro__subtitle {
  max-width: 90%; /* Modified for responsiveness */
  margin-bottom: 3rem; /* Modified for responsiveness */
}

/* Styles for the content block */
.intro__box {
  width: 90%; /* Modified for responsiveness */
  max-width: 700px; /* Maximum width */
  height: auto; /* Automatic height for content */
  padding: 2rem; /* Adjusted padding for responsiveness */
  margin-bottom: 5rem; /* Modified for responsiveness */
  background: rgba(0, 0, 0, 0.85);
  border-radius: 15px;
  color: aliceblue;
}

/* Styles for the join button */
.wrapper__join {
  display: flex;
  flex-wrap: wrap;
  min-width: 128px;
  height: 50px;
  padding: 10px;
  text-align: center;
  border-radius: 10px;
  flex-shrink: 0;
  background-color: rgba(55, 146, 225, 0.85);
  font-weight: bold;
  align-items: center;
  color: aliceblue;
  font-size: 1.2rem;
  margin-right: 10px; /* Added right margin for button separation */
  margin-bottom: 10px; /* Added bottom margin for button separation */
  justify-content: center; /* Align text to center */
}

/* Styles for the login button */
.wrapper__login {
  display: flex;
  flex-wrap: wrap;
  min-width: 85px;
  height: 50px;
  padding: 10px;
  text-align: center;
  border-radius: 10px;
  flex-shrink: 0;
  background-color: rgba(46, 47, 48, 0.85);
  font-weight: bold;
  align-items: center;
  color: aliceblue;
  font-size: 1.2rem;
  margin-bottom: 10px; /* Added bottom margin for button separation */
  justify-content: center; /* Align text to center */
}

/* Styles for buttons */
.intro__btn {
  display: flex;
  justify-content: center;
  gap: 1rem; /* Space between buttons */
  margin-top: 1rem; /* Modified for responsiveness */
  font-size: 1.5rem;
}

/* Styles for the block with icons */
.box {
  width: 90%; /* Modified for responsiveness */
  max-width: 700px; /* Maximum width */
  height: auto;
  padding: 2rem; /* Adjusted padding for responsiveness */
  margin-bottom: 5rem; /* Modified for responsiveness */
  background: rgba(0, 0, 0, 0.85);
  border-radius: 15px;
  color: aliceblue;
}

.item__wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.item {
  position: relative;
  flex: 0 0 calc(50% - 20px); /* Width of each item is 50%, considering spacing */
  max-width: calc(
    50% - 20px
  ); /* Maximum width of each item is 50%, considering spacing */
  height: auto;
  padding: 10px; /* Spacing between items */
  margin: 10px; /* Margin around items */
  font-size: 1.2rem;
  text-align: center;
  align-items: center;
}

.icon {
  width: 60px;
  height: 60px;
  margin-bottom: 20px;
  text-align: center;
  align-items: center;
}

/* If you want each item to be in a row on narrower screens */
@media (max-width: 600px) {
  .item {
    flex-basis: calc(
      100% - 20px
    ); /* Width of each item is 100%, considering spacing */
    max-width: calc(
      100% - 20px
    ); /* Maximum width of each item is 100%, considering spacing */
  }

  .intro__wrapper {
    flex-direction: column;
  }

  .intro__title {
    font-size: 1.5rem;
  }
}
</style>
