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
        <div class="icons">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
          >
            <path fill="#888888" d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
          </svg>
        </div>
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
        <div class="sidebar__link">
          <RouterLink to="/dashboard">
            <div class="icons">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
              >
                <path
                  d="M4 11h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1zm10 0h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1zM4 21h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1zm10 0h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <span class="nav-item">Dashboard</span>
          </RouterLink>
        </div>
        <span class="tooltip">Dashboard</span>
      </li>
      <li>
        <div class="sidebar__link">
          <RouterLink to="/notes/add">
            <div class="icons">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10s10-4.486 10-10S17.514 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <span class="nav-item">Add note</span>
          </RouterLink>
        </div>
        <span class="tooltip">Add note</span>
      </li>
      <li>
        <div class="sidebar__link">
          <RouterLink to="#">
            <div class="icons">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#f62424"
                  d="M2.76 20.2a2.73 2.73 0 0 0 2.15.85a8.86 8.86 0 0 0 3.37-.86a9 9 0 0 0 12.27-10.9c1.31-2.23 1.75-4.26.67-5.48a2.94 2.94 0 0 0-2.57-1A5 5 0 0 0 16.1 4A9 9 0 0 0 3.58 15.14c-1.06 1.21-2.05 3.68-.82 5.06m1.5-1.32c-.22-.25 0-1.07.37-1.76a9.26 9.26 0 0 0 1.57 1.74c-1.03.3-1.71.28-1.94.02m14.51-5.17A7 7 0 0 1 15.58 18A7.12 7.12 0 0 1 12 19a6.44 6.44 0 0 1-1.24-.13a30.73 30.73 0 0 0 4.42-3.29a31.5 31.5 0 0 0 3.8-4a6.88 6.88 0 0 1-.21 2.13m.09-8.89a.94.94 0 0 1 .87.32c.23.26.16.94-.26 1.93a9.2 9.2 0 0 0-1.61-1.86a2.48 2.48 0 0 1 1-.39M5.22 10.31A6.94 6.94 0 0 1 8.41 6A7 7 0 0 1 12 5a6.9 6.9 0 0 1 6 3.41a5.19 5.19 0 0 1 .35.66a27.43 27.43 0 0 1-4.49 5A27.35 27.35 0 0 1 8.35 18a7 7 0 0 1-3.13-7.65z"
                />
              </svg>
            </div>
            <span class="nav-item">Spaces</span>
          </RouterLink>
        </div>
        <span class="tooltip">Spaces</span>
      </li>
      <li>
        <div class="sidebar__link">
          <RouterLink to="/notes/feed">
            <div class="icons">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396l1.414-1.414l-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8s3.589 8 8 8m0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6s-6-2.691-6-6s2.691-6 6-6"
                />
                <path
                  fill="currentColor"
                  d="M11.412 8.586c.379.38.588.882.588 1.414h2a3.977 3.977 0 0 0-1.174-2.828c-1.514-1.512-4.139-1.512-5.652 0l1.412 1.416c.76-.758 2.07-.756 2.826-.002"
                />
              </svg>
            </div>
            <span class="nav-item">Feed</span>
          </RouterLink>
        </div>
        <span class="tooltip">Feed</span>
      </li>
      <li>
        <div class="sidebar__link">
          <RouterLink to="#">
            <div class="icons">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
              >
                <path
                  d="M16 2H8C4.691 2 2 4.691 2 8v13a1 1 0 0 0 1 1h13c3.309 0 6-2.691 6-6V8c0-3.309-2.691-6-6-6zm1 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <span class="nav-item">Message</span>
          </RouterLink>
        </div>
        <span class="tooltip">Message</span>
      </li>
      <li>
        <div class="sidebar__link">
          <RouterLink to="#">
            <div class="icons">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M12 16c2.206 0 4-1.794 4-4s-1.794-4-4-4s-4 1.794-4 4s1.794 4 4 4m0-6c1.084 0 2 .916 2 2s-.916 2-2 2s-2-.916-2-2s.916-2 2-2"
                />
                <path
                  fill="currentColor"
                  d="m2.845 16.136l1 1.73c.531.917 1.809 1.261 2.73.73l.529-.306A8.1 8.1 0 0 0 9 19.402V20c0 1.103.897 2 2 2h2c1.103 0 2-.897 2-2v-.598a8.132 8.132 0 0 0 1.896-1.111l.529.306c.923.53 2.198.188 2.731-.731l.999-1.729a2.001 2.001 0 0 0-.731-2.732l-.505-.292a7.718 7.718 0 0 0 0-2.224l.505-.292a2.002 2.002 0 0 0 .731-2.732l-.999-1.729c-.531-.92-1.808-1.265-2.731-.732l-.529.306A8.1 8.1 0 0 0 15 4.598V4c0-1.103-.897-2-2-2h-2c-1.103 0-2 .897-2 2v.598a8.132 8.132 0 0 0-1.896 1.111l-.529-.306c-.924-.531-2.2-.187-2.731.732l-.999 1.729a2.001 2.001 0 0 0 .731 2.732l.505.292a7.683 7.683 0 0 0 0 2.223l-.505.292a2.003 2.003 0 0 0-.731 2.733m3.326-2.758A5.703 5.703 0 0 1 6 12c0-.462.058-.926.17-1.378a.999.999 0 0 0-.47-1.108l-1.123-.65l.998-1.729l1.145.662a.997.997 0 0 0 1.188-.142a6.071 6.071 0 0 1 2.384-1.399A1 1 0 0 0 11 5.3V4h2v1.3a1 1 0 0 0 .708.956a6.083 6.083 0 0 1 2.384 1.399a.999.999 0 0 0 1.188.142l1.144-.661l1 1.729l-1.124.649a1 1 0 0 0-.47 1.108c.112.452.17.916.17 1.378c0 .461-.058.925-.171 1.378a1 1 0 0 0 .471 1.108l1.123.649l-.998 1.729l-1.145-.661a.996.996 0 0 0-1.188.142a6.071 6.071 0 0 1-2.384 1.399A1 1 0 0 0 13 18.7l.002 1.3H11v-1.3a1 1 0 0 0-.708-.956a6.083 6.083 0 0 1-2.384-1.399a.992.992 0 0 0-1.188-.141l-1.144.662l-1-1.729l1.124-.651a1 1 0 0 0 .471-1.108"
                />
              </svg>
            </div>
            <span class="nav-item">Settings</span>
          </RouterLink>
        </div>
        <span class="tooltip">Settings</span>
      </li>
      <li>
        <div class="sidebar__link">
          <RouterLink to="#">
            <div class="icons">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
              >
                <path fill="currentColor" d="M16 13v-2H7V8l-5 4l5 4v-3z" />
                <path
                  fill="currentColor"
                  d="M20 3h-9c-1.103 0-2 .897-2 2v4h2V5h9v14h-9v-4H9v4c0 1.103.897 2 2 2h9c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2"
                />
              </svg>
            </div>
            <span class="nav-item">Logout</span>
          </RouterLink>
        </div>
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
.icons svg {
  width: 24px;
  height: 24px;
}

.icons path {
  fill: rgb(105, 105, 105);
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

.top .sidebar__logo .icons {
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

.sidebar ul li .sidebar__link {
  color: aliceblue;
  display: flex;
  align-items: center;
  text-decoration: none;
  border-radius: 0.8rem;
}

.sidebar ul li .sidebar__link:hover {
  background-color: rgb(55, 146, 225);
  color: #12171e;
}

.sidebar ul li .sidebar__link .icons {
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
