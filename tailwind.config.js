const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    './resources/views/**/*.blade.php',
    './resources/js/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        'primary-purple': '#9333ea',
        'secondary-purple': '#c084fc',
        'accent-pink': '#d946ef',
        'background-dark': '#0f0f17',
        'text-light': '#e8d9ff',
        'text-muted': '#a3a3a3',
        'card-bg': 'rgba(255, 255, 255, 0.05)',

        'purple': '#7b2ff2',
        'purple-dark': '#4e085f',
        'purple-mystery': '#7b2ff2',
        'purple-mystery-light': '#f357a8',
        'pink': '#ff1493',
        'white': '#f5f5ff',
      },
      fontFamily: {
        fredoka: ['Fredoka', 'Arial', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        poppins: ['Poppins', 'Montserrat', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 0 25px #c084fc33',
        'card-hover': '0 0 35px #9333ea55',
        'flair': '0 0 24px #6a0dad55, 0 0 8px #6a0dad44',
        'flair-hover': '0 0 48px #ff1493cc, 0 0 16px #fff',
      },
      borderRadius: {
        'xl': '24px',
        '2xl': '32px',
        'full': '999px',
      },
    },
  },
  plugins: [],
};
