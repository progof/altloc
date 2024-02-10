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
  /* width: 90px;
  height: 30px; */
  flex-shrink: 0;
  background-color: #2925e0;
  stroke-width: 1px;
  stroke: #000;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  padding: 10px;
  color: #000;
  border-radius: 10px;
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
  color: #fffefe;
}
</style>
