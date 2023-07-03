new cursoreffects.rainbowCursor({ element: document.querySelector("#rainbow") })
new cursoreffects.fairyDustCursor({ element: document.querySelector("#fairyDust") })
new cursoreffects.ghostCursor({ element: document.querySelector("#ghost") })
new cursoreffects.trailingCursor({ element: document.querySelector("#trailing")})
new cursoreffects.followingDotCursor({ element: document.querySelector("#following") })
new cursoreffects.springyEmojiCursor({ element: document.querySelector("#springs") })
new cursoreffects.emojiCursor({ element: document.querySelector("#emoji") })
new cursoreffects.bubbleCursor({ element: document.querySelector("#bubbles") })
new cursoreffects.snowflakeCursor({ element: document.querySelector("#snowflake") })
new cursoreffects.characterCursor({ 
    element: document.querySelector("#character"), 
    characters: ["h", "e", "l", "l", "o"],
    font: "15px serif",
    colors: [
        "#6622CC",
        "#A755C2",
        "#B07C9E",
        "#B59194",
        "#D2A1B8",
    ],
    characterLifeSpanFunction: function() {
        return Math.floor(Math.random() * 60 + 80);
    },
    initialCharacterVelocityFunction: function() {
        return {
            x: (Math.random() < 0.5 ? -1 : 1) * Math.random() * 5,
            y: (Math.random() < 0.5 ? -1 : 1) * Math.random() * 5,
        }
    },
    characterVelocityChangeFunctions: {
      x_func: function(age, lifeSpan) {
        return (Math.random() < 0.5 ? -1 : 1)/30;
      },
      y_func: function(age, lifeSpan) {
        return (Math.random() < 0.5 ? -1 : 1)/ 15;
      },
    },
    characterScalingFunction: function(age, lifeSpan) {
        let lifeLeft = lifeSpan - age;
        return Math.max(lifeLeft / lifeSpan * 2, 0);
    },
    characterNewRotationDegreesFunction: function(age, lifeSpan) {
        let lifeLeft = lifeSpan - age;
        console.log(age, lifeSpan);
        return lifeLeft / 5;
    }
})
new cursoreffects.clockCursor({ element: document.querySelector("#clock") })
new cursoreffects.textFlag({ element: document.querySelector("#textFlag"), text: 'Like & Subscribe' })
