<script setup lang="ts">
import { ref } from "vue";

const isSidebarActive = ref(false);

const toggleSidebar = () => {
  isSidebarActive.value = !isSidebarActive.value;
};
</script>

<template>
  <div class="sidebar" :class="{ active: isSidebarActive }">
    <div class="top">
      <div class="sidebar__logo">
        <span>Alteranium</span>
      </div>
      <a href="#" @click="toggleSidebar" id="btn">
        <img src="../assets/icons/BxMenu.svg" alt="" class="icons" />
      </a>
    </div>
    <div class="user">
      <img src="../assets/default_avatar.png" alt="" class="user-img" />
      <div>
        <p class="bold">Client B. Joe</p>
        <p>Admin</p>
      </div>
    </div>
    <ul>
      <li>
        <a href="#">
          <img lass="icons" src="../assets/icons/BxBxsGridAlt.svg" alt="" />
          <span class="nav-item">Dashboard</span>
        </a>
        <span class="tooltip">Dashboard</span>
      </li>
      <li>
        <a href="#">
          <img lass="icons" src="../assets/icons/BxPlanet.svg" alt="" />
          <span class="nav-item">Spaces</span>
        </a>
        <span class="tooltip">Spaces</span>
      </li>
      <li>
        <a href="#">
          <img lass="icons" src="../assets/icons/BxSearchAlt.svg" alt="" />
          <span class="nav-item">Feed</span>
        </a>
        <span class="tooltip">Feed</span>
      </li>
      <li>
        <a href="#">
          <img
            lass="icons"
            src="../assets/icons/BxBxsMessageSquareAdd.svg"
            alt=""
          />
          <span class="nav-item">Message</span>
        </a>
        <span class="tooltip">Message</span>
      </li>
      <li>
        <a href="#">
          <img lass="icons" src="../assets/icons/BxCog.svg" alt="" />
          <span class="nav-item">Settings</span>
        </a>
        <span class="tooltip">Settings</span>
      </li>
      <li>
        <a href="#">
          <img lass="icons" src="../assets/icons/BxLogOut.svg" alt="" />
          <span class="nav-item">Logout</span>
        </a>
        <span class="tooltip">Logout</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.user-img {
  width: 50px;
  border-radius: 100%;
  border: 1x solid whitesmoke;
}

.sidebar {
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  width: 80px;
  background-color: rgb(15, 14, 14);
  padding: 0.4rem 0.8rem;
  transition: all 0.5ms ease;
  opacity: 0.9;
}

/* .sidebar.active ~ .main-content {
  left: 250px;
  width: calc(100% - 250px);
} */

.sidebar.active {
  width: 250px;
}

.icons {
  fill: #f62424;
}

.sidebar #btn {
  position: absolute;
  color: aliceblue;
  top: 0.4rem;
  left: 50%;
  font-size: 1.2rem;
  line-height: 50px;
  transform: translateX(-50%);
  cursor: pointer;
}

.sidebar.active #btn {
  left: 90%;
}

.sidebar .top .sidebar__logo {
  color: aliceblue;
  display: flex;
  height: 50px;
  width: 100%;
  align-items: center;
  pointer-events: none;
  opacity: 0;
}

.sidebar.active .top .sidebar__logo {
  opacity: 1;
}

.top .sidebar__logo img {
  font-size: 2rem;
  margin-right: 10px;
}

.user {
  display: flex;
  align-items: center;
  margin: 1rem 0;
}
.user p {
  color: aliceblue;
  opacity: 1;
  margin-left: 1rem;
}

.bold {
  font-weight: 600;
}

.sidebar p {
  opacity: 0;
}

.sidebar.active p {
  opacity: 1;
}

.sidebar ul li {
  position: relative;
  list-style-type: none;
  height: 50px;
  width: 90%;
  margin: 0.8rem auto;
  line-height: 50px;
}

.sidebar ul li a {
  color: aliceblue;
  display: flex;
  align-items: center;
  text-decoration: none;
  border-radius: 0.8rem;
}

.sidebar ul li a:hover {
  background-color: rgb(55, 146, 225);
  color: #12171e;
}

.sidebar ul li a img {
  min-width: 50px;
  text-align: center;
  height: 50px;
  border-radius: 12px;
  line-height: 50px;
}

.sidebar .nav-item {
  opacity: 0;
}

.sidebar.active .nav-item {
  opacity: 1;
}

.tooltip {
  background-color: rgb(55, 146, 225);
  color: #12171e;
}
.sidebar ul li .tooltip {
  position: absolute;
  left: 125px;
  top: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0.5rem 0.8rem rgb(0, 0, 0.2);
  border-radius: 0.6rem;
  padding: 0.4rem 1.2rem;
  line-height: 1.8rem;
  z-index: 20;
  opacity: 0;
}

.sidebar ul li:hover .tooltip {
  opacity: 1;
}

.sidebar.active ul li .tooltip {
  display: none;
}

.tooltip span {
  margin-right: 50px;
}
</style>
