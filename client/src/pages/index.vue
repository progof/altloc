<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<template>
  <main class="main">
    <section class="intro">
      <div class="wrapper">
        <div class="intro__wrapper">
          <div class="intor__box">
            <h1 class="intro__title">
              The perfect platform for creating a circle of interest
            </h1>

            <p class="intro__subtitle">
              Alteranium connects students to each other to create an atmosphere
              where it is easy to learn and create projects
            </p>

            <div class="intro__btn">
              <RouterLink to="/register" class="intro__submit"
                >Join now</RouterLink
              >
              <RouterLink to="/login" class="intro__submit">Login</RouterLink>
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
      </div>
    </section>
  </main>
</template>

<style scoped>
.intro {
  height: 100vh;
  padding-top: 265px;
}

.intro__wrapper {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  padding-right: 40px;
}

.wrapper {
  max-width: 1060px;
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

.intor__box {
  padding: 34px;
  width: 632px;
  height: 420px;
  flex-shrink: 0;
  background: black;
  opacity: 85%;
  margin-bottom: 100px;
}

.intro__btn {
  display: flex;
  flex-wrap: wrap;
}

.intro__submit {
  padding: 15px 39px;
  margin-right: 60px;
  color: #0b020e;
  text-align: center;
  font-size: 24px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  background-color: #2925e0;
  text-decoration: none;
}

/* 
body {
  font-family: "Arial", sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}


div {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}


h1 {
  color: #333;
}


p {
  color: #666;
}


.about-section,
.advantages-section {
  margin-top: 40px;
}

h2 {
  color: #333;
}

ul {
  list-style-type: disc;
  padding-left: 20px;
}

li {
  color: #666;
} */
/* 
.about-section {
  width: 732px;
  height: 540px;
  flex-shrink: 0;
  fill: linear-gradient(
    180deg,
    rgba(16, 4, 21, 0.15) 47%,
    rgba(44, 5, 63, 0.15) 100%
  );
  color: aliceblue;
}

.h2 {
  color: #fff;

  text-align: center;
  font-size: 48px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}

.p {
  color: #fff;
  text-align: center;
  font-family: Inter;
  font-size: 32px;
  font-style: normal;
  font-weight: 300;
  line-height: normal;
} */

/* div {
  max-width: 1060px;
  margin: 0 auto;
  padding: 20px;
} */
</style>
