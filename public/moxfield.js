// Get DOM elements
const moxfieldInput = document.getElementById('moxfieldInput');
const imageSize = document.getElementById('imageSize');
const inbox = document.getElementById('inbox');
const deck = document.getElementById('deck');
const historyButton = document.getElementById('historyButton');
const deckMenu = document.getElementById('deckMenu');
const sliderContainer = document.getElementById('sliderContainer');
const cardTypes = {
	0: 'Commander',
	1: 'Battle',
	2: 'Planeswalker',
	3: 'Creature',
	4: 'Sorcery',
	5: 'Instant',
	6: 'Artifact',
	7: 'Enchantment',
	8: 'Land',
};

const manaSymbols = {
    W: 'PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAxMDAgMTAwJz48ZyBmaWxsPSdub25lJz48Y2lyY2xlIGZpbGw9JyNGOEY2RDgnIGN4PSc1MCcgY3k9JzUwJyByPSc1MCcvPjxwYXRoIGQ9J005Ny42OTEgNTcuMDY0Yy02LjU2MS0zLjY5OS0xMC43NjgtNS41NTEtMTIuNjE3LTUuNTUxLTEuMzQ0IDAtMi4zOTUgMS4wMzItMy4xNTQgMy4wOTItLjc1OCAyLjA2My0yLjI3IDMuMDktNC41NDEgMy4wOS0uOTI2IDAtMi44MTgtLjMzNi01LjY3OC0xLjAwOC0xLjU5OCAyLjQ0LTIuMzk4IDMuOTk2LTIuMzk4IDQuNjY4IDAgLjkyNi42ODkgMi4wMTYgMi4wNjQgMy4yODEgMS4zNzUgMS4yNjIgMi41MzUgMS44OTEgMy40ODIgMS44OTEuNjAyIDAgMS40MTYtLjEyNSAyLjQ0OS0uMzc5IDEuMDMxLS4yNSAxLjcyMS0uMzc3IDIuMDY0LS4zNzcgMS4wMzMgMCAxLjU0NyAxLjg5MyAxLjU0NyA1LjY3OCAwIDMuNjE3LS44NCA5LjE2OC0yLjUyMyAxNi42NTQtMi4xODgtOC41OC00LjUtMTIuODcxLTYuOTM4LTEyLjg3MS0uMzM4IDAtMS4wMzEuMjUyLTIuMDgyLjc2LTEuMDUzLjUwMi0xLjgzLjc1NC0yLjMzNC43NTQtMi40MzggMC00LjYyNS0yLjIyNy02LjU2MS02LjY4OC0zLjg2OS41OS01LjgwNSAyLjU2Ny01LjgwNSA1LjkzNCAwIDEuNjg0Ljc3NyAzLjAyNyAyLjMzNiA0LjAzNSAxLjU1MyAxLjAwOCAyLjMzNCAxLjcyNyAyLjMzNCAyLjE0NSAwIDIuMjczLTMuMzI0IDUuNzY0LTkuOTY5IDEwLjQ3My0zLjUzMSAyLjUyMy01Ljk3MyA0LjI4OS03LjMxNiA1LjI5NyAxLjE3NC0xLjUxMiAyLjM1Mi0zLjQ4NyAzLjUzMy01LjkyOCAxLjM0NC0yLjc3NSAyLjAxOC00LjkyIDIuMDE4LTYuNDM2IDAtLjg0LS45NjctMi4wMi0yLjkwMi0zLjUzMy0xLjkzNi0xLjUxMi0yLjktMy4xMTEtMi45LTQuNzkzIDAtMS40MjguNTAyLTMuMTkzIDEuNTEyLTUuMjk5LTEuMDk0LTEuMjYyLTIuMzk1LTEuODk1LTMuOTEtMS44OTUtMy4zNjUgMC01LjA0NSAxLjA5Ni01LjA0NSAzLjI4djMuNDA2Yy4wODIgMi43NzYtMi4wMiA0LjE2NC02LjMxMSA0LjE2NC0zLjI3OSAwLTguNzkxLS43NTktMTYuNTI3LTIuMjcxIDguNzQ4LTIuMTg4IDEzLjEyMS00LjcxMSAxMy4xMjEtNy41NyAwIC4zMzYtLjE2OC0uNjcyLS41MDQtMy4wMjgtLjMzOC0yLjYwNCAxLjUxNC00Ljk2MSA1LjU1MS03LjA2My0uNzU4LTMuODY3LTIuNzczLTUuODA2LTYuMDU3LTUuODA2LS41MDQgMC0xLjQzMi44ODQtMi43NzUgMi42NDctMS4zNDYgMS43NzEtMi42MDcgMi42NTItMy43ODMgMi42NTItMi4wMiAwLTQuNjI5LTIuMTg2LTcuODIyLTYuNTYzLTEuNTE2LTIuMTg0LTMuODMtNS40MjQtNi45NDEtOS43MTUgMS45MzQgMS4wMTIgMy44NjkgMi4wMiA1LjgwNSAzLjAzMSAyLjUyMyAxLjE3NiA0LjU0MSAxLjc2NiA2LjA1NyAxLjc2NiAxLjE3OCAwIDIuMzM0LTEuMDMxIDMuNDY5LTMuMDkyIDEuMTM1LTIuMDYxIDIuNjI5LTMuMDkyIDQuNDc5LTMuMDkyLjI1NCAwIDEuOTM2LjUwNCA1LjA0NyAxLjUxNiAxLjU5Ni0yLjQzOSAyLjM5OC00LjI0OCAyLjM5OC01LjQyNiAwLTEuMDEtLjYxMS0yLjE2Ni0xLjgzLTMuNDcxLTEuMjIxLTEuMzAzLTIuMzM0LTEuOTU1LTMuMzQ0LTEuOTU1LS40MjIgMC0xLjA3Mi4xMjUtMS45NTcuMzc5LS44ODEuMjUyLTEuNTMzLjM3OS0xLjk1My4zNzktMS41MTYgMC0yLjI3My0xLjg5My0yLjI3My01LjY3OCAwLTEuMDEuOTY5LTYuNzcgMi45MDQtMTcuMjg1LS4wODYgMS4yNi40NjEgMy42MTcgMS42MzkgNy4wNjQgMS40MyA0LjIwNyAzLjExMSA2LjMwOSA1LjA0OSA2LjMwOS4zMzQgMCAxLjAwOC0uMjUyIDIuMDE4LS43NTggMS4wMDgtLjUwNCAxLjgwNy0uNzU0IDIuMzk2LS43NTQgMS45MzQgMCAzLjUzMSAxLjA5NCA0Ljc5NSAzLjI3N2wxLjg5MyAzLjQwNmMxLjc2NiAwIDMuMjM4LS42MjkgNC40MTQtMS44OTEgMS4xNzgtMS4yNjIgMS43NjgtMi43NzcgMS43NjgtNC41NDMgMC0xLjg1LS43NzctMy4yNi0yLjMzNC00LjIyNy0xLjU1OS0uOTY3LTIuMzM2LTEuNzAzLTIuMzM2LTIuMjA3IDAtMS43NjggMi43NzctNC43NTIgOC4zMjgtOC45NTggNC40NTctMy4zNjMgNy4zNTktNS4zNCA4LjcwNy01LjkzLTMuNjE3IDQuODc5LTUuNDI2IDguNDUxLTUuNDI2IDEwLjcyNCAwIDEuMTc4LjcxMyAyLjQ0MSAyLjE0NSAzLjc4NSAxLjc2NiAxLjU5OCAyLjc3NSAyLjczNCAzLjAyNyAzLjQwNi44NCAxLjkzOC43NTYgNC41ODYtLjI1MiA3Ljk0OSAyLjI3MSAxLjYgMy45OTQgMi4zOTYgNS4xNzQgMi4zOTYgMi40MzYgMCAzLjY1OC0xLjI2NCAzLjY1OC0zLjc4NSAwLS4yNTItLjEwNS0xLjA1MS0uMzE0LTIuMzk2LS4yMTMtMS4zNDQtLjI3My0yLjEwMi0uMTkxLTIuMjcxLjMzNi0xLjE3OCAyLjY1LTEuNzY4IDYuOTM5LTEuNzY4IDIuNjkxIDAgOC4yODMuNzU4IDE2Ljc4MSAyLjI3My0xLjg1Mi41MDQtNC42MjcgMS4yNi04LjMyNiAyLjI3LTMuMzY1IDEuMDEtNS4wNDkgMi4xNDUtNS4wNDkgMy40MDYgMCAuNTkuMjA5IDEuNTk4LjYzMSAzLjAyNy40MiAxLjQzMi42MzMgMi40OC42MzMgMy4xNTYgMCAxLjE3Ni0uNzU4IDIuMjctMi4yNzEgMy4yNzdsLTQuMjkxIDMuMDMxYzEuMDEgMS44NTIgMS42ODIgMi45NDUgMi4wMiAzLjI3OS44NCAxLjAwOCAxLjk3NSAxLjUxNCAzLjQwNiAxLjUxNCAxLjAxIDAgMS45MzQtLjg4MyAyLjc3NS0yLjY0OC44NC0xLjc2OCAyLjE4OC0yLjY1IDQuMDM3LTIuNjUgMi4yNyAwIDQuODM4IDIuMTA0IDcuNjk3IDYuMzExIDEuNTkzIDIuMzYgNC4wNzUgNS45MzMgNy40NCAxMC43Mjd6bS0yOC4wMDctNy4zMTZjMC01LjM4MS0xLjk3OS0xMC4wNTEtNS45MzItMTQuMDA2LTMuOTUzLTMuOTUzLTguNjIxLTUuOTMtMTQuMDA0LTUuOTMtNS40NjkgMC0xMC4xOCAxLjk1Ny0xNC4xMzEgNS44NjktMy45NTMgMy45MS01Ljk3MyA4LjYtNi4wNTUgMTQuMDY2LS4wODYgNS4zODMgMS45MTIgMTAuMDMgNS45OTIgMTMuOTM4IDQuMDggMy45MTIgOC44MTEgNS44NjkgMTQuMTkzIDUuODY5IDUuNzE5IDAgMTAuNDkyLTEuODczIDE0LjMxOC01LjYxNSAzLjgzLTMuNzQgNS43MDEtOC40NyA1LjYxOS0xNC4xOTF6bS0xLjg5MyAwYzAgNS4xMzEtMS43MjUgOS4zODEtNS4xNzQgMTIuNzQtMy40NTEgMy4zNjctNy43NCA1LjA0OS0xMi44NjkgNS4wNDktNC45NjMgMC05LjIxMS0xLjcyMy0xMi43NDItNS4xNzQtMy41MzEtMy40NDUtNS4yOTktNy42NTItNS4yOTktMTIuNjE1IDAtNC44NzcgMS43ODUtOS4wNjQgNS4zNTktMTIuNTUzIDMuNTc4LTMuNDkgNy44MDMtNS4yMzggMTIuNjgyLTUuMjM4IDQuODc3IDAgOS4xMDQgMS43NjYgMTIuNjggNS4zMDEgMy41NzQgMy41MzMgNS4zNjMgNy42OTUgNS4zNjMgMTIuNDl6JyBmaWxsPScjMEQwRjBGJy8+PC9nPjwvc3ZnPgo=',
    U: 'PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAxMDAgMTAwJz48ZyBmaWxsPSdub25lJz48Y2lyY2xlIGZpbGw9JyNDMUQ3RTknIGN4PSc1MCcgY3k9JzUwJyByPSc1MCcvPjxwYXRoIGQ9J002Ny40ODggODMuNzE5Yy00Ljc4NyA0Ljg3MS0xMC42ODQgNy4zMDctMTcuNjg4IDcuMzA3LTcuODYxIDAtMTQuMDk4LTIuNjktMTguNzExLTguMDczLTQuMzU5LTUuMTI3LTYuNTM3LTExLjY2Mi02LjUzNy0xOS42MDYgMC04LjU0MyAzLjcxNy0xOC4yODYgMTEuMTUtMjkuMjI0IDYuMDY0LTguOTY5IDEzLjE5OS0xNi44MyAyMS40MDItMjMuNTgtMS4xOTcgNS40NjktMS43OTMgOS4zNTUtMS43OTMgMTEuNjYyIDAgNS4yOTkgMS42NjQgMTAuNDY3IDQuOTk2IDE1LjUwOCA0LjEwMiA1Ljk4IDcuMjE5IDEwLjQyNiA5LjM1NyAxMy4zMjggMy4zMzIgNS4wNDMgNC45OTggOS45NTUgNC45OTggMTQuNzM3LjAwMiA3LjA5My0yLjM5MSAxMy4wNzQtNy4xNzQgMTcuOTQxem0tLjEyOS0yNy4zNjJjLTEuMjgxLTIuODYxLTIuNzc3LTQuNzYyLTQuNDg2LTUuNzAzLjI1Ni41MTQuMzg1IDEuMjQuMzg1IDIuMTggMCAxLjc5NS0uNTEyIDQuMzU3LTEuNTM5IDcuNjg5bC0xLjY2NCA1LjEyN2MwIDIuOTkgMS40OTIgNC40ODYgNC40ODQgNC40ODYgMy4xNiAwIDQuNzQyLTIuMDk1IDQuNzQyLTYuMjgxIDAtMi4xMzQtLjY0LTQuNjMyLTEuOTIyLTcuNDk4eicgZmlsbD0nIzBEMEYwRicvPjwvZz48L3N2Zz4K',
    B: 'PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAxMDAgMTAwJz48ZyB0cmFuc2Zvcm09J3RyYW5zbGF0ZSgwIC0xKScgZmlsbD0nbm9uZSc+PGNpcmNsZSBmaWxsPScjQkFCMUFCJyBjeD0nNTAnIGN5PSc1MC45OTgnIHI9JzUwJy8+PHBhdGggZD0nTTkwLjY5NSA0OS42MTljMCA1LjUxOC0yLjAwOCA5LjI4MS02LjAyIDExLjI4Ny0xLjE3Mi41ODYtNC44NSAxLjM3OS0xMS4wMzcgMi4zODMtNC4wMTIuNjctNi4wMTggMi4yMTctNi4wMTggNC42Mzl2MTAuMTU4YzAgLjQyMi4xMjUgMS43MTUuMzc1IDMuODg5bC4zNzcgNC4wMTRjMCAxLjI1NS0uMjkzIDMuMzA2LS44NzkgNi4xNDYtMS41ODguMzM0LTMuNDI4LjcwOS01LjUxOCAxLjEzMi0uNjctMi41MTEtMS4wMDQtNC4yMjQtMS4wMDQtNS4xNDYgMC0uNDE2LjEwNS0xLjA0NS4zMTMtMS44ODIuMjA3LS44MzQuMzE2LTEuNDYxLjMxNi0xLjg4MyAwLS41OC0uNTItMi4yMTMtMS41NTktNC44ODdoLTEuOTQ1Yy0uMjU4LjQxOC0uMzQ0Ljk2MS0uMjYgMS42MjkuMzM0IDEuNDIyLjQ1OSAyLjYzMy4zNzcgMy42MzctMS40MjIgMS4wMDQtMy4zODcgMi4zNDEtNS44OTUgNC4wMTMtLjU4Ni0uMTY2LS43OTMtLjI1LS42MjktLjI1di04LjkwNGMtLjE2NC0uNDE2LS41ODQtLjU4MS0xLjI1NC0uNTAyaC0xLjUwNGwtMS41MDQgMTEuNzg3Yy0xLjE3NC4wODQtMi41OTIuMDg0LTQuMjY0IDAtLjU4OC0yLjc1OC0xLjYzMS02Ljg1My0zLjEzNS0xMi4yODloLTEuMDA0Yy0uOTIyIDIuOTI5LTEuNDIyIDQuNTE5LTEuNTA2IDQuNzY5IDAgLjMzNC4xMDQuOTgxLjMxNCAxLjk0Mi4yMDcuOTYyLjMxMyAxLjYwOS4zMTMgMS45NDMgMCAuMjUtLjA4NC44NzctLjI1IDEuODgxbC0uMzc3IDMuMDFjLS4xNjguMTY2LS4zNzcuMjUtLjYyNy4yNS0yLjUwOCAwLTQuMTgyLS42MjctNS4wMTYtMS44NzktLjgzNi0xLjI1Ni0xLjE3Mi0zLjAxMi0xLjAwNC01LjI3MWwxLjAwNC0xNS4wNDdjMC0uMjUyLjA4Mi0uNTg2LjI1LTEuMDA0LjE2NC0uNDE4LjI1LS43MTEuMjUtLjg3NyAwLS42Ny0uNzExLTIuMDA4LTIuMTMxLTQuMDE0LS4yNDgtLjA4Mi0xLjU0OS0uMzc3LTMuODg3LS44NzktMS40MjQtLjMzNC00LjIyNS0uOTE4LTguNDAyLTEuNzU2LTUuNzcxLTEuMDg0LTguNjU0LTUuNzI1LTguNjU0LTEzLjkyIDAtMTIuMjA3IDUuMDE4LTIyLjM2NSAxNS4wNTEtMzAuNDc1LjQxNCAyLjI1OCAxLjEyNyA1LjI2NiAyLjEyOSA5LjAyOS43NTQuMTcgMi4zODUuNTQ1IDQuODkxIDEuMTI5LjUwNC4xNjggMy4wNTMgMS4wODggNy42NTIgMi43Ni0yLjM0NC0xLjQyMi01LjM5My0zLjcxOS05LjE1Ni02Ljg5OC0xLjQyMi0xLjY3Mi0yLjEzMy00LjQ3MS0yLjEzMy04LjQgMC0uOTIgMS41OS0yLjAwOCA0Ljc2OC0zLjI2NCAyLjg0LTEuMTcgNC45NzUtMS44MzYgNi4zOTYtMi4wMDYgNC41MTQtLjU4MiA3Ljk4NC0uODc5IDEwLjQxLS44NzkgMTAuNDQ5IDAgMTguODkxIDIuNjc4IDI1LjMyOCA4LjAyOS0yLjA4OCAyLjQyNi01LjY4NCA1LjAxNC0xMC43ODMgNy43NzMgMi4wMDguMDg0IDQuOTM0LS43MDcgOC43NzktMi4zODMgMy44NDQtMS42NyA1LjQ3NS0yLjUwOCA0Ljg5MS0yLjUwOC42NjggMCAyLjAwOCAxLjM0IDQuMDE0IDQuMDE0IDEuNTA0IDIuMDA2IDIuNzE1IDMuODA3IDMuNjM3IDUuMzkxIDIuNjc0IDQuNzY4IDQuNDcxIDkuOTA4IDUuMzkzIDE1LjQyNiAwIDEuOTI2LjA0MSAzLjMwNS4xMjUgNC4xMzl2MS4wMDRoLjAwMnptLTQ4LjAzMSAyLjI1OGMwLTMuNTk0LTEuNTY4LTcuMDAyLTQuNzAzLTEwLjIyMy0zLjEzNy0zLjIxOS02LjUwMi00LjgyNi0xMC4wOTYtNC44MjYtMy4xNzggMC01Ljk3NyAxLjM0OC04LjQwMiA0LjAzOS0yLjQyNiAyLjY5My0zLjYzNyA1LjY4Mi0zLjYzNyA4Ljk2MyAwIDIuODU5IDEuMzc5IDQuNzEzIDQuMTM5IDUuNTUzIDEuNzU2LjUwNiA0LjIxOS44MDEgNy4zOTguODgzaDYuODk4YzUuNTk4LjA4NCA4LjQwMy0xLjM3OSA4LjQwMy00LjM4OXptMTMuNjY4IDE1LjU1M3YtMy44ODljLS41ODQtMS4wODYtMS4xNy0yLjIxNS0xLjc1NC0zLjM4Ny0uNTAyLTEuNjc0LTEuNDIyLTQuMDE0LTIuNzYtNy4wMjVsLTEuMzgxIDE0LjY3NGMwIDEuMTcyLS4yNSAxLjc1Ni0uNzUyIDEuNzU2LS4zMzQgMC0uNTg0LS4wODItLjc1Mi0uMjQ4LS41ODYtOC44NjMtLjg3OS0xMi43MDktLjg3OS0xMS41NDF2LTQuMzg3Yy0uMTY4LS4yNTQtLjM3NS0uMzc5LS42MjUtLjM3OS0yLjg0NCAyLjkzLTQuMjY0IDcuNjUyLTQuMjY0IDE0LjE3MiAwIDMuNTk2LjMzIDUuODExIDEuMDAyIDYuNjQ4LjY3LS4xNjYgMS40MjItLjQ1OSAyLjI1OC0uODc3LjMzNC0uMTY4IDEuMjk1LS4yNTIgMi44ODctLjI1MiAxLjU4NCAwIDMuNTEuNTAyIDUuNzY2IDEuNTA0LjgzNiAwIDEuMjU0LTIuMjU2IDEuMjU0LTYuNzY5em0yOC4zNDQtMTcuNDc1YzAtMy4zNjctMS4yNTQtNi4zNzUtMy43NjItOS4wMjUtMi41MS0yLjY0OC01LjM5NS0zLjk3NS04LjY1Mi0zLjk3NS0zLjUxMiAwLTYuNzk1IDEuNjA3LTkuODQ2IDQuODI2LTMuMDUzIDMuMjE5LTQuNTc4IDYuNTg0LTQuNTc4IDEwLjA5NiAwIDIuOTI4IDEuNDIgNC4zODkgNC4yNjQgNC4zODloMTQuNDIyYzUuNDMzLS4wODIgOC4xNTItMi4xODYgOC4xNTItNi4zMTF6JyBmaWxsPScjMEQwRjBGJy8+PC9nPjwvc3ZnPgo=',
    R: 'PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAxMDAgMTAwJz48ZyBmaWxsPSdub25lJz48Y2lyY2xlIGZpbGw9JyNFNDk5NzcnIGN4PSc1MCcgY3k9JzUwJyByPSc1MCcvPjxwYXRoIGQ9J005MS45NjUgNjYuNjE3Yy0zLjczNiA4LjkxMi0xMS4xNiAxMy4zNjctMjIuMjc1IDEzLjM2Ny0yLjAzNyAwLTQuMjQ2LjI1NC02LjYyMS43NjItMy41NjQuNzY0LTUuMzQ2IDEuODI4LTUuMzQ2IDMuMTg2IDAgLjQyNC4yOTUuOTEuODkxIDEuNDYzLjU5Mi41NTMgMS4xMDQuODI2IDEuNTI3LjgyNi0yLjEyMyAwLS42OC4wNjQgNC4zMjYuMTkxIDUuMDA4LjEyNyA4LjE0OC4xOTEgOS40MjIuMTkxLTcuMzgzIDQuMzI2LTE5LjczMiA2LjMxOS0zNy4wNDMgNS45ODEtNS42ODgtLjA4NC0xMC41NjYtMi41ODgtMTQuNjM5LTcuNTEtMy45OTItNC42NjktNS45ODQtOS44ODgtNS45ODQtMTUuNjU4IDAtNi4xMDggMi4wNTctMTEuMzA4IDYuMTc2LTE1LjU5NSA0LjExMy00LjI4MiA5LjIyOS02LjQyNyAxNS4zMzgtNi40MjcgMS4zNTcgMCAzLjE2LjI5NyA1LjQxLjg5MSAyLjI0OC41OTQgMy43NTYuODkxIDQuNTE4Ljg5MSAzLjEzOSAwIDcuMDQ1LTEuMjkzIDExLjcxMy0zLjg4MyA0LjY2Ni0yLjU4OCA2Ljg3NS0zLjg4MyA2LjYyMS0zLjg4My0uODUgOC45MTItMy44MiAxNC44OTYtOC45MTQgMTcuOTQ4LTMuNjQ4IDIuMTIzLTUuNDczIDQuMjAxLTUuNDczIDYuMjM2IDAgMS4yNzMuNzY0IDIuMjkzIDIuMjkxIDMuMDU3IDEuMTg4LjU5NSAyLjUwMi44OTIgMy45NDUuODkyIDIuMjA3IDAgNC4zNzEtMS4zNTYgNi40OTQtNC4wNzEgMi4xMTktMi43MTggMy4wNTUtNS4xNzcgMi44MDEtNy4zODYtLjI1NC0yLjU0NS0uMDg0LTUuNjAzLjUxLTkuMTY0LjE2OC0xLjAyLjc4My0yLjI3IDEuODQ0LTMuNzU0IDEuMDYxLTEuNDg2IDIuMDE2LTIuMzk4IDIuODY1LTIuNzM4IDAgLjc2Mi0uMjc1IDIuMDM3LS44MjggMy44MTgtLjU1MyAxLjc4MS0uODI2IDMuMS0uODI2IDMuOTQ3IDAgMS44NjcuNTA4IDMuMzA5IDEuNTI3IDQuMzI2IDEuNTI1LS41OTIgMi44ODMtMi41MDIgNC4wNzQtNS43MjkgMS4wMTYtMi40NTkgMS42MDktNC44MzYgMS43ODEtNy4xMjctMy41NjYtLjE3LTYuOTgyLTEuNzgxLTEwLjI0OC00LjgzOC0zLjI2OC0zLjA1Ny00LjktNi4zNjUtNC45LTkuOTI4IDAtLjU5NC4wODItMS4xODguMjU2LTEuNzgzLjUwOC43NjQgMS4yNzEgMS45NTMgMi4yODkgMy41NjQgMS40NDMgMi4xMjEgMi41NDcgMy4xODIgMy4zMTMgMy4xODIgMS4wMTYgMCAxLjUyNS0xLjA2MSAxLjUyNS0zLjE4MiAwLTIuNzE1LS43MjMtNS4xNzYtMi4xNjQtNy4zODMtMS42MTMtMi42MzEtMy42OTMtMy45NDctNi4yMzgtMy45NDctMS4xODkgMC0yLjk3MS42MzctNS4zNDQgMS45MS0yLjM3OSAxLjI3MS00LjU0MyAxLjkxLTYuNDkyIDEuOTEtLjU5NiAwLTMuMjI5LS43NjYtNy44OTUtMi4yOTMgOC4yMy0xLjM1NSAxMi4zNDgtMi41ODYgMTIuMzQ4LTMuNjkxIDAtMi44ODUtNS42NDUtNC44MzgtMTYuOTMtNS44NTUtMS4xMDUtLjA4NC0zLjE0MS0uMjU0LTYuMTExLS41MS4zMzgtLjQyNCAyLjc1OC0uODkxIDcuMjU4LTEuNCAzLjgxOC0uNDIyIDYuNDkyLS42MzcgOC4wMTgtLjYzNyAyMC4xOTcgMCAzMy4wMTIgOS44MDUgMzguNDQzIDI5LjQwOC45MzQtLjc3MyAxLjQwMi0yLjA2NiAxLjQwMi0zLjg3MSAwLTIuMzI0LS42OC01LjI1LTIuMDM3LTguNzc3LS41MTItMS4zNzUtMS4zMTgtMy40NDEtMi40Mi02LjE5MyA2Ljk1NyA4Ljg2NyAxMC40MzkgMTcuMjcgMTAuNDM5IDI1LjE5OSAwIDQuMTc4LS45NzkgNy45NzMtMi45MyAxMS4zODEtMS4yNyAyLjMwMy0zLjY1IDUuMjQ0LTcuMTI3IDguODI2LTMuNDggMy41OC01Ljg1NyA2LjM1Mi03LjEzMSA4LjMxMyA0LjY2OC0xLjI3MSA3LjcyNS0yLjI0OCA5LjE2OC0yLjkyOCAzLjIyMy0xLjQ0IDYuMTUtMy42MDYgOC43ODMtNi40OTIgMCAxLjEwNi0uNDY3IDIuNzYyLTEuNCA0Ljk2N3ptLTU1LjUwMi01MC4wMjVjMCAxLjUyNS0uODUgMi41MDItMi41NDUgMi45MjZsLTMuMzExLjUxYy0xLjE4OS41OTQtMi45MjggMi45MjgtNS4yMTkgNy0uMjU2LTEuMjcxLS42MzctMy4wNTMtMS4xNDYtNS4zNDYtLjc2NC4wODYtMi4wMzUuNzY0LTMuODE4IDIuMDM3LS43NjQuNTk0LTEuOTk2IDEuNDg0LTMuNjkzIDIuNjcyLjUxMi0zLjA1NSAyLjIwNy02LjE0OCA1LjA5NC05LjI5MyAzLjA1NS0zLjQ3NyA2LjAyNS01LjIxNyA4LjkxLTUuMjE3IDMuODE4IDAgNS43MjggMS41NzIgNS43MjggNC43MTF6bTIyLjE1IDExLjcwOWMwIDEuNDQzLS43ODUgMi42NTQtMi4zNTUgMy42MjktMS41Ny45NzctMy4xMTkgMS40NjUtNC42NDYgMS40NjUtMi4wMzcgMC0zLjg2My0xLjE0Ni01LjQ3My0zLjQzOC0xLjk1NS0yLjgwMS0zLjk0Ny00LjYyNS01Ljk4NC01LjQ3Ny40MjQtLjQyMi45MzQtLjYzNSAxLjUyOS0uNjM1Ljc2NCAwIDIuMDU1LjU5NCAzLjg4MSAxLjc4MSAxLjgyNCAxLjE4OSAyLjk5IDEuNzgzIDMuNTAyIDEuNzgzLjQyNCAwIDEuMTIzLS41OTQgMi4xLTEuNzgzLjk3NS0xLjE4OCAyLjA1Ny0xLjc4MSAzLjI0Ni0xLjc4MSAyLjguMDAxIDQuMiAxLjQ4NyA0LjIgNC40NTZ6JyBmaWxsPScjMEQwRjBGJy8+PC9nPjwvc3ZnPgo=',
    G: 'PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAxMDAgMTAwJz48ZyBmaWxsPSdub25lJz48cGF0aCBkPSdNMTAwIDQ5Ljk5OGMwIDI3LjYxNS0yMi4zODUgNTAuMDAyLTUwLjAwMiA1MC4wMDItMjcuNjEzIDAtNDkuOTk4LTIyLjM4Ny00OS45OTgtNTAuMDAyIDAtMjcuNjEzIDIyLjM4NS00OS45OTggNDkuOTk4LTQ5Ljk5OCAyNy42MTcgMCA1MC4wMDIgMjIuMzg1IDUwLjAwMiA0OS45OTh6JyBpZD0nU2hhcGUnIGZpbGw9JyNBM0MwOTUnLz48cGF0aCBkPSdNOTMuNzYyIDU2LjIyNWMwIDEuNjY4LS42NDUgMy4xNjQtMS45MzYgNC40OTgtMS4yODkgMS4zMzItMi43NyAxLjk5OC00LjQzNiAxLjk5OC0yLjY2MiAwLTQuNjIzLTEuMjUtNS44NjktMy43NDhsLTUuODcxLS4yNWMtMS4yNTIgMC0zLjcwOS41NDMtNy4zNzEgMS42MjUtMy45MTQgMS4wODItNi4xNjQgMS45NTctNi43NDYgMi42MjMtLjkxNi45OTgtMS42NjQgMy4zMzItMi4yNDggNi45OTYtLjUwMiAyLjk5OC0uNzQ4IDUuMjA1LS43NDggNi42MjEgMCAyLjI0Ni4zNTIgMy44OTMgMS4wNjEgNC45MzQuNzA5IDEuMDQxIDIuMTY2IDEuOTE2IDQuMzcxIDIuNjIzIDIuMjA1LjcwNyAzLjU2MSAxLjEwNCA0LjA2MSAxLjE4Ny4zMzIgMCAuODczLS4wNDEgMS42MjUtLjEyNWgxLjQ5OGMxLjA4IDAgMi4yMDUuMTcgMy4zNzMuNSAxLjY2Ni41IDIuMzc1IDEuMTY2IDIuMTI1IDItMS4xNjgtLjE2Ni0zLjIwNy4wODQtNi4xMjEuNzVsMy40OTYgMS43NDhjMCAxLTEuNDE2IDEuNDk4LTQuMjQ2IDEuNDk4LS43NTIgMC0xLjc3MS0uMTY2LTMuMDYzLS40OTgtMS4yOTEtLjMzNi0yLjE0NS0uNS0yLjU1OS0uNWgtMS42MjVjLS4wODIuODMyLS4zMzQgMi4wOC0uNzUgMy43NDYtMS40MTgtLjA4NC0zLjA4LS45MTgtNC45OTYtMi40OTgtMS45MTgtMS41OC0zLjEyMy0yLjM3My0zLjYyMS0yLjM3My0uNTAyIDAtMS4yMTEuNzkzLTIuMTI1IDIuMzczLS45MTggMS41OC0xLjM3NSAyLjY2NC0xLjM3NSAzLjI0OC0xLjA4Mi0uNTg0LTEuOTk2LTEuNjY4LTIuNzUtMy4yNDgtLjMzMi0xLjA4NC0uNzA3LTIuMTY2LTEuMTIxLTMuMjQ4LS44MzIuMDg0LTIuMzc1IDEuODM0LTQuNjIxIDUuMjQ4aC0uNjI3Yy0uMTY2LS4yNTItLjc5NS0yLTEuODczLTUuMjQ4LTIuNTgyLS44MzItNC45OTYtMS4yNDgtNy4yNDYtMS4yNDgtMS4wODIgMC0yLjc0OC4yNS00Ljk5Ni43NDhsLTMuNDk2LS4yNDhjLjQ5OC0uNSAxLjk1NS0xLjQ1NyA0LjM3MS0yLjg3MyAyLjgzLTEuNjY2IDQuOTk2LTIuNSA2LjQ5Ni0yLjUuMjQ2IDAgLjU3OC4wNDMgMSAuMTI1LjQxNC4wODYuNzUuMTI1IDEgLjEyNS41NzggMCAxLjUxOC0uMzEyIDIuODA5LS45MzggMS4yOTEtLjYyMyAyLjAzOS0xLjE4NiAyLjI0Ni0xLjY4NC4yMTEtLjUwNC4zMTYtMS43OTMuMzE2LTMuODc1IDAtNC43NDYtMS4yNS04LjI4NS0zLjc1LTEwLjYxNy0yLjE2OC0yLjA4Mi01Ljc0Ni0zLjU4LTEwLjc0NC00LjQ5OC0xLjMzMiA0Ljc0Ni01LjA4IDcuMTIzLTExLjI0IDcuMTIzLTIgMC0zLjk5OC0xLjIwNy01Ljk5Ni0zLjYyMy0xLjk5Ni0yLjQxNi0yLjk5Ni00LjYyMy0yLjk5Ni02LjYyMSAwLTMuMDgyIDEuMjg3LTUuNjIxIDMuODY5LTcuNjIzLTIuMDgtMi4xNjItMy4xMjEtNC4zNjktMy4xMjEtNi42MTcgMC0yLjA4NC42NDMtMy45MTQgMS45MzYtNS41IDEuMjkxLTEuNTc4IDIuOTc3LTIuNDk2IDUuMDU5LTIuNzQ4LS4xNjYtMi42NjIuNzA3LTQuNDk2IDIuNjIzLTUuNDk2LS45MTYtLjkxNC0xLjM3My0yLjUzNy0xLjM3My00Ljg2OSAwLTIuNzQ4LjkxNi01LjAzOSAyLjc0OC02Ljg3MSAxLjgzLTEuODMyIDQuMTIxLTIuNzUgNi44NjktMi43NSAzIDAgNS40NTcgMS4wNDUgNy4zNzEgMy4xMjUgMi40MTYtOC4yNDQgNy42MjEtMTIuMzY3IDE1LjYxMy0xMi4zNjcgNC4xNjQgMCA3LjgyOCAxLjY2NiAxMC45OTQgNC45OTggMS4xNjYgMS4yNDggMS43NDggMS45MTYgMS43NDggMS45OTYtMSAwLS40OTgtLjE4OCAxLjUtLjU2MSAxLjk5Ni0uMzc1IDMuNDUzLS41NjMgNC4zNzMtLjU2MyAzLjI0NiAwIDYuMTE5IDEuMjA3IDguNjE5IDMuNjIzIDIuMTY0IDIuMTY2IDMuNjY0IDQuOTEyIDQuNDk4IDguMjQ0LjU4LjA4NCAxLjQ5OC4zMzIgMi43NDguNzQ4IDEuODMuOTIgMi43NDggMi40OTggMi43NDggNC43NDggMCAuNDE4LS4zMzYgMS4yMDktMSAyLjM3MyA1LjMyOCAyLjk5OCA3Ljk5NCA3LjE2MiA3Ljk5NCAxMi40OTIgMCAxLjQ5OC0uNTgyIDMuNTg0LTEuNzQ4IDYuMjQ3IDIuMTY2IDEuMjQ3IDMuMjQ2IDMuMDgxIDMuMjQ2IDUuNDk1em0tNTEuNDY3IDUuNDk2di0xLjYyM2MwLTEuOTE0LS45MzYtMy42NjQtMi44MDktNS4yNDYtMS44NzUtMS41ODItMy43Ny0yLjM3My01LjY4NC0yLjM3My0yLjMzNCAwLTQuNDk2LjU0MS02LjQ5NiAxLjYyMSA0LjQxMy0uMjQ4IDkuNDExIDIuMjkzIDE0Ljk4OSA3LjYyMXptLTIuMjQ2LTE1LjQ4OWMtMS4yNS0xLjQxOC0yLjMzMi0yLjg3NS0zLjI1LTQuMzczLTMuNDk4LjkxNi01LjI0NiAxLjk1Ny01LjI0NiAzLjEyMSAxLS4wOCAyLjQ1Ny4xMDUgNC4zNzEuNTY0IDEuOTE0LjQ1OSAzLjI5MS42ODggNC4xMjUuNjg4em03LjYyMS0zLjg3M3YtNS40OTZjLTItLjMzMi0zLjIxMS0uNS0zLjYyMy0uNXYxLjg3M2wzLjYyMyA0LjEyM3ptMTYuMjM4LTMuNDk4Yy0xLS40MTYtMi44NzUtMS4yNS01LjYyMS0yLjQ5OHYxMC43NDJjMy45MTItMi4yNSA1Ljc4NS00Ljk5OCA1LjYyMS04LjI0NHptNi44NjcgMTQuNzQxbC0yLjc0Ni0zLjM3M2MtMS42NjQgMS4xNjctMy4zNTIgMi4zNTQtNS4wNjEgMy41NjEtMS43MDkgMS4yMDctMy4xODYgMi41NjMtNC40MzIgNC4wNiAzLjc0Ny0yLjAwMiA3LjgyOS0zLjQxNCAxMi4yMzktNC4yNDh6JyBmaWxsPScjMEQwRjBGJy8+PC9nPjwvc3ZnPgo=',
    C: 'PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAxMDAgMTAwJz48ZyBmaWxsPSdub25lJz48cGF0aCBkPSdNMTAwIDUwYzAgMjcuNjA5LTIyLjM4MiA1MC01MCA1MHMtNTAtMjIuMzkxLTUwLTUwIDIyLjM4Mi01MCA1MC01MCA1MCAyMi4zOTEgNTAgNTB6JyBpZD0nU2hhcGUnIGZpbGw9JyNDQUM1QzAnLz48cGF0aCBkPSdNNDkuNjg3IDEyLjAyNmMyLjQ3NSA0Ljk2OCA1LjUwNCA5Ljc5MyA5LjA5NiAxNC40NzUgMS41MjggMS45NjYgMy4yNzkgNC4wMjEgNS4yNTQgNi4xNDcgMS45NDggMi4xMjYgNC4xMSA0LjI1MyA2LjQ1MSA2LjM0NCAyLjM1OSAyLjA5MSA0Ljk0MSA0LjA3NCA3Ljc1NiA1Ljk1MSAyLjgxNSAxLjg3NiA1Ljg0MyAzLjU5MiA5LjA5NiA1LjEyOS00Ljc4IDIuNTU2LTkuNTE2IDUuNjY1LTE0LjIyNSA5LjM0Ni0xLjk1NiAxLjUzNy00LjAwMyAzLjMwNi02LjE0NyA1LjMyNS0yLjEyNiAyLjAwMi00LjIxNyA0LjItNi4yNjMgNi41NzYtMi4wNDYgMi40MTItNC4wMTIgNS4wMDQtNS44OTcgNy44MjctMS44NzcgMi44MDYtMy41ODMgNS43OS01LjEyIDguOTUzLTIuMzk1LTQuNy01LjM3OS05LjM0Ni04Ljk2Mi0xMy45NTYtMy4wNzQtMy45MzEtNi45Ni04LjA1OS0xMS42Ni0xMi40Mi00LjY5MS00LjM2LTEwLjM3My04LjIzOC0xNy4wMy0xMS42NTEgNC43ODktMi40ODQgOS41MjUtNS41NTcgMTQuMjI0LTkuMjIxIDQuMDEyLTMuMTYzIDguMTQ5LTcuMTEyIDEyLjQxMS0xMS44NDggNC4yNy00LjczNiA3LjkzMy0xMC4zODMgMTEuMDE2LTE2Ljk3N3ptLTUuNTA0IDUyLjg5NWMyLjIyNSAyLjgyNCA0LjA1NiA1LjY4MyA1LjUwNCA4LjU3OCAxLjg4NS00LjAyMSA0LjE0Ni03LjQ3IDYuNzgxLTEwLjM2NSAyLjY0NS0yLjkxMyA1LjIxOC01LjM0MyA3LjY5My03LjMwOSAyLjgxNC0yLjE5OCA1Ljc1NC00LjEyOCA4LjgzNy01Ljc3Mi00LjEwMS0xLjg1OS03LjU4Ni00LjEyOC0xMC40MzYtNi43NzMtMi44NjgtMi42NDUtNS4yODEtNS4yLTcuMjM3LTcuNjg0LTIuMjI1LTIuODA1LTQuMTEtNS43OS01LjYzOC04Ljk1My0xLjg3NiA0LjA5Mi00LjEyOCA3LjU5NS02LjcxOSAxMC40OS0yLjYwOSAyLjkxMy01LjE0NiA1LjMyNS03LjYyMiA3LjMwOS0yLjgyMyAyLjIxNi01Ljc2MyA0LjA3NC04LjgzNyA1LjYyOSA0LjEwMSAyLjEyNyA3LjU5NSA0LjUyMSAxMC40OTkgNy4xNjYgMi45MDQgMi42NDUgNS4yOTkgNS4yMTggNy4xNzUgNy42ODR6JyBmaWxsPScjMDAwJy8+PC9nPjwvc3ZnPgo='
}

/**
 * Initial Page Load
 */

async function checkLogin() {
	const response = await fetch('/auth-status');
	if (response.status === 401) {
		window.location = 'login';
	}
}

function addNavOffset() {
    const height = document.getElementById('nav').offsetHeight;
	document.documentElement.style.setProperty('--nav-height', `${height}px`);
}

document.addEventListener('DOMContentLoaded', () => {
	// make sure the user is logged in
	checkLogin();
	// load their last deck
	const deckID = localStorage.getItem('deckID');
	if (deckID) {
		loadDeck(deckID);
	} else {
        loadHistory();
    }
    addNavOffset()
});


function loadHistory() {
    try {
        deck.classList.add('hidden');
        sliderContainer.classList.add('hidden');
        deckMenu.classList.remove('hidden');
        deckMenu.innerHTML = '';

        const deckMeta = JSON.parse(localStorage.getItem('history'));
        Object.entries(deckMeta).forEach(([id, meta]) => {
            const menuItem = document.createElement('div');
            menuItem.className = 'deckMenuItem';
            menuItem.onclick = (event) => loadDeck(id);

            const menuContent = document.createElement('div');
            menuContent.className = 'menuContent';

            const thumbnail = document.createElement('img');
            thumbnail.className = 'thumbnail';
			thumbnail.src = meta.thumbnail;
            menuContent.appendChild(thumbnail)

            const summary = document.createElement('div');
            menuContent.append(summary);

            const deckTitle = document.createElement('div');
            deckTitle.textContent = meta.name;
            summary.appendChild(deckTitle)

            meta.colors.forEach((color) => {
                const manaSymbol = document.createElement('img');
                manaSymbol.className = 'manaSymbol';
                manaSymbol.src = `data:image/svg+xml;base64,${manaSymbols[color]}`
                summary.appendChild(manaSymbol)
            })
            if (meta.colors.length === 0) {
                const manaSymbol = document.createElement('img');
                manaSymbol.className = 'manaSymbol';
                manaSymbol.src = `data:image/svg+xml;base64,${manaSymbols.C}`
                summary.appendChild(manaSymbol)
            }

            const deleteButton = document.createElement('i');
            deleteButton.id = id;
            deleteButton.className = 'fa fa-trash';
            deleteButton.onclick = (event) => {
                const history = JSON.parse(localStorage.getItem('history')) ?? {}
                console.log(event)
                delete history[event.target.id];
                localStorage.setItem('history', JSON.stringify(history));
                localStorage.removeItem('deckID');
                loadHistory()
                event.stopPropagation()
            }
            menuItem.append(menuContent)
            menuItem.append(deleteButton)

            deckMenu.appendChild(menuItem);
        });

        deck.innerHTML = '';
    } catch (error) {
        console.error("error during user auth: ", error);
    }

}

historyButton.onclick = () => loadHistory()

/**
 * Card Resizing
 */

function sizeDown() {
	imageSize.value++;
	resizeImages();
}

/**
 * Decrements the value of the #imageSize slider and triggers a resize of the deck images.
 */
function sizeUp() {
	imageSize.value--;
	resizeImages();
}

function resizeImages(event) {
	const slider = imageSize;
	const width = Math.floor(deck.getBoundingClientRect().width / slider.value) - 1;
	document.documentElement.style.setProperty('--image-width', `${width}px`);
	document.documentElement.style.setProperty('--image-radius', `${width * 0.05}px`);
	addNavOffset()
}

// resize when window size changes
onresize = () => resizeImages();
// resize when when the slider input changes
imageSize.addEventListener('input', (_) => resizeImages());
// resize for small screens
if (deck.getBoundingClientRect().width < 500) {
	imageSize.value = 2;
}

/**
 * Deck Loading
 */

moxfieldInput.addEventListener('keydown', function (e) {
	if (e.key === 'Enter' && !e.shiftKey) {
		processURL();
		e.preventDefault();
	}
});

function processURL() {
	const message = moxfieldInput.value.trim();
	if (message !== '') {
		const urlMatch = message.match(/https:\/\/(www\.)?moxfield\.com\/decks\/([^\/]+)/);
        console.log(urlMatch)
		if (urlMatch.length === 3) {
			const [_, www, deckID] = urlMatch;
			loadDeck(deckID);
		}
	}
	moxfieldInput.value = '';
}

async function loadDeck(id) {
	// clear the page
    deckMenu.classList.add('hidden');
    deck.classList.remove('hidden');
    sliderContainer.classList.remove('hidden');
	deck.innerHTML = '';
	// fetch the deck data, load images from it
	const response = await fetch(`/deck/${id}`);
	const data = await response.json();
	loadImages(data.boards);

    const history = JSON.parse(localStorage.getItem('history')) ?? {}

    const featuredID =  data.boards.commanders.count > 0 ? Object.values(data.boards.commanders.cards)[0].card.id : data.main.id

    history[id] = {
        name: data.name,
        colors: data.colors,
        thumbnail: `https://assets.moxfield.net/cards/card-${featuredID}-art_crop.webp`
    }
    const sortedEntries = Object.entries(history).sort((a, b) => {
        // Compare values (a[1] and b[1])
        return a[1].name.localeCompare(b[1].name);
    });

    // Reconstruct a sorted object (if needed)
    const sortedObj = Object.fromEntries(sortedEntries);

    localStorage.setItem('history', JSON.stringify(sortedObj))
    localStorage.setItem('deckID', id);
}

function loadImages(data) {
	// sorting bin, an array per card type
	const bin = {};
	Object.keys(cardTypes).forEach((typeID) => (bin[typeID] = []));
	// collect commanders and sort mainboard cards based on type
	Object.values(data.commanders.cards).forEach(({ card }) => bin[0].push(card));
	Object.values(data.mainboard.cards).forEach(({ card }) => bin[card.type].push(card));

	Object.entries(bin).forEach(([cType, cArray]) => {
		// skip it if we don't have that type
		if (cArray.length == 0) {
			return;
		}

		const header = document.createElement('div');
		header.className = 'cardType';
		header.textContent = cardTypes[cType];
		deck.appendChild(header);

		const content = document.createElement('div');
		content.className = 'cardBox';
		deck.appendChild(content);

		// sort the cards aplhabetically
		// cArray.sort((a,b) => a.name > b.name);
		cArray.sort((a, b) => {
			const nameA = a.name.toUpperCase(); // ignore upper and lowercase
			const nameB = b.name.toUpperCase(); // ignore upper and lowercase
			if (nameA < nameB) {
				return -1;
			}
			if (nameA > nameB) {
				return 1;
			}

			// names must be equal
			return 0;
		});

		// add images to the content div
		cArray.map((card) => {
			const imgBox = document.createElement('div');
			imgBox.className = 'imgBox';
			const cardImg = document.createElement('img');
			cardImg.className = 'card';
			cardImg.onclick = (event) => discordMessage(event.target, event.target.dataset.type === 'Land' ? 'plays' : 'casts');
			cardImg.alt = card.name;

			// assume it's a one-sided card
			cardImg.src = `https://assets.moxfield.net/cards/card-${card.id}-normal.webp`;
			cardImg.dataset.type = cardTypes[cType];
			cardImg.dataset.front = card.id;
			cardImg.dataset.back = '';
			// check for double faced cards but exclude certain types
			if (card.card_faces.length > 0 && !['adventure', 'split'].includes(card.layout)) {
				const [front, back] = card.card_faces.map(({ id }) => id);
				cardImg.src = `https://assets.moxfield.net/cards/card-face-${front}-normal.webp`;
				cardImg.dataset.front = front;
				cardImg.dataset.back = back;
			}

			imgBox.appendChild(cardImg);
			content.appendChild(imgBox);
		});
	});

	// make sure they fit the window properly
	resizeImages();
}

async function discordMessage(card, verb) {
	// css animation
	card.classList.add('clicked');
	setTimeout(() => {
		card.classList.remove('clicked');
	}, 250);

	const body = JSON.stringify({
		verb: verb,
		type: card.dataset.type,
		front_id: card.dataset.front,
		back_id: card.dataset.back,
	});

	const response = await fetch('/emit', {
		headers: {
			'Content-Type': 'application/json',
		},
		method: 'POST',
		body,
	});
	if (response.status === 401) {
		window.location = 'login';
	}
}

function hideMenu() {
    document.getElementById("contextMenu").style.display = "none"
}

function rightClick(e) {
    e.preventDefault();
    if (e.target.className !== 'card') {
        return
    }

    targetCard = e.target;

    if (document.getElementById("contextMenu").style.display == "block")
        hideMenu()
    else {
        let menu = document.getElementById("contextMenu")
        menu.style.display = 'block';
        menu.style.left = e.pageX + "px";
        menu.style.top = e.pageY + "px";
    }
}

function contextMenuClick({target: {textContent}}) {
    discordMessage(targetCard, `${textContent}s`)
}

document.onclick = hideMenu;
document.oncontextmenu = rightClick;
const contextMenu = document.getElementById('contextMenu');
contextMenu.onclick = contextMenuClick;
let targetCard = null;
