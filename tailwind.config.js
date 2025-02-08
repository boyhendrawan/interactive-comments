/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}"],
  theme: {
    screens:{
      sm: '375px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    extend: {
      animation:{
        'ease-in':'easein 0.5s ease-in 0s 1 normal forwards',
        'ease-out':'easeout 0.5s ease-out 0s 1 normal forwards',
      },
      keyframes:{
        easeout:{
          '0%':{
            opacity:'1',
            transform:'translateY(-1rem)'
          },
          '100%':{
            opacity:'0',
            transform:'translateY(0%)'
          }
        },
        easein:{
          '0%':{
            opacity:'0',
          },
          '100%':{
            opacity:'1',
            transform:'translateY(1rem)'
          }

        },
      },
      colors:{
      'moderate-blue':'#5457b6',
      'soft-red':'#ed6468',
      'light-grayish-blue':'#c3c4ef',
      'pale-red':'#ffb8bb',
      'dark-blue' :'#324152',
      'grayish-blue':'#67727e',
      'light-gray':'#eaecf1',
      'very-light-gray':'#f5f6fa',
      }
    },
    fontFamily:{
      inter:["Inter"]
    },


  },
  plugins: [
   
  ],
}

