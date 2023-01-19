# Tic-Tac-Toe

My implementation building the classic Tic-Tac-Toe game.
This game was mainly built with vanilla Javascript and it stresses on Factory Constructor and the Module Pattern.

## Challenges
A challenge I faced were trying to figure out how to remove the event listener from the squares on the grid. For some reason, it would only remove the bottom right square event listener and I could not figure out how. I decided to use a boolean flag to check when the game is over and disable the click event there.

Another challenge was figuring out a good way to check each rows, columns and diagonals and see if there was a winner. My mind wanted to solve it all at once but I broke down my problem and focused on smaller parts, like figure out how to do one row or one column and the rest was solved at ease.
