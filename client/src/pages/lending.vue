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
              Join a special interest group (space).
            </div>
            <div class="item">
              <NotesIcon class="icon" />
              Create notes for the group
            </div>
            <div class="item">
              <EventsIcon class="icon" />
              Participate in activities to integrate with other group members
            </div>
            <div class="item">
              <ThoughtsIcon class="icon" />
              Sharing his thoughts on his wall
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.intro__wrapper {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-around;
  padding-right: 40px;
  padding-top: 10%;
}

.wrapper {
  max-width: 1200px;
  margin: 0 auto;
}

.intro__title {
  max-width: 619px;
  color: #fff;
  text-align: center;
  font-size: 48px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  margin-bottom: 22px;
}

.intro__subtitle {
  max-width: 619px;
  color: #fff;
  text-align: center;
  font-size: 32px;
  font-style: normal;
  font-weight: 300;
  line-height: normal;
  margin-bottom: 44px;
}

.intro__box {
  display: flex;
  flex-direction: column;
  padding: 34px;
  width: 632px;
  height: 460px;
  flex-shrink: 0;
  background: black;
  opacity: 85%;
  margin-bottom: 100px;
  border-radius: 15px;
}

.intro__btn {
  display: flex;
  flex-wrap: wrap;
}

.intro__submit {
  /* padding: 15px 39px;
  margin-right: 60px; */
  color: #fffefe;
  text-align: center;
  font-size: 24px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  text-decoration: none;
}

.wrapper__join {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  width: 90px;
  height: 30px;
  flex-shrink: 0;
  background-color: rgb(55, 146, 225);
  stroke-width: 1px;
  stroke: #000;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  padding: 10px;
  color: #000;
  border-radius: 10px;
  width: 128px;
  height: 50px;
  text-align: center;
}

.wrapper__login {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  background-color: #181818;
  padding: 10px;
  border-radius: 10px;
  padding: 10px;
  margin-left: 60px;
  text-align: center;
  color: #fffefe;
  margin-right: 20px; /* Добавлено смещение справа */
  width: 85px;
  height: 50px;
  font-size: 20px;
}

.box {
  padding: 34px;
  width: 100%;
  height: 20%;
  flex-shrink: 0;
  background: black;
  opacity: 85%;
  margin-bottom: 100px;
  border-radius: 15px;
  text-align: center;
  align-items: center;
}

.item__wrapper {
  display: flex;
  flex-direction: row;
  padding: 20px;
}

.item {
  position: relative; /* Добавлено */
  padding: 10px;
  flex-wrap: wrap;
  color: aliceblue;
  margin-left: 5%;
  padding-top: 5%;
  font-size: 20px;
}

.icon {
  position: absolute; /* Добавлено */
  top: -30px; /* Измените это значение в зависимости от вашего дизайна */
  left: 50%; /* Измените это значение в зависимости от вашего дизайна */
  transform: translateX(-50%); /* Центрирует иконку горизонтально */
  width: 60px; /* Измените размер иконки по вашему желанию */
  height: 60px; /* Измените размер иконки по вашему желанию */
}
</style>
