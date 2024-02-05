<script setup lang="ts">
import { ref } from "vue";

const slogan = ref("Take notes with ease.");
</script>

<template>
  <div>
    <h1>Welcome to Xnote!</h1>
    <p>{{ slogan }}</p>

    <section class="about-section">
      <h2>About Xnote</h2>
      <p>
        Xnote is a web application designed for students to easily exchange
        notes and knowledge with each other. Whether you need to share class
        notes, collaborate on projects, or simply connect with your peers, Xnote
        provides a seamless platform for efficient knowledge exchange.
      </p>
    </section>

    <section class="advantages-section">
      <h2>Why Choose Xnote?</h2>
      <ul>
        <li>
          Effortless Note Sharing: Share your class notes or study materials
          effortlessly with just a few clicks.
        </li>
        <li>
          Collaborative Learning: Collaborate on projects, assignments, and
          study sessions with your peers.
        </li>
        <li>
          Community Connection: Connect with other students, join study groups,
          and expand your academic network.
        </li>
        <li>
          Secure and Private: Your data is kept secure, and you have control
          over who can access your shared content.
        </li>
        <!-- Add more advantages as needed -->
      </ul>
    </section>
  </div>
</template>

<style scoped>
/* Global styles */
body {
  font-family: "Arial", sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Page container styles */
div {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

/* Header styles */
h1 {
  color: #333;
}

/* Slogan styles */
p {
  color: #666;
}

/* Section styles */
.about-section,
.advantages-section {
  margin-top: 40px;
}

/* Section title styles */
h2 {
  color: #333;
}

/* List styles */
ul {
  list-style-type: disc;
  padding-left: 20px;
}

/* List item styles */
li {
  color: #666;
}
</style>
