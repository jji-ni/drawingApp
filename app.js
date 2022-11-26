const saveBtn = document.getElementById("save"); //id="save"인 엘리먼트 불러옴
const textInput = document.getElementById("text"); //id="text"인 엘리먼트 불러옴
const fileInput = document.getElementById("file"); //id="file"인 엘리먼트 불러옴
const eraserBtn = document.getElementById("eraser-btn"); //
const destroyBtn = document.getElementById("destroy-btn");
const modeBtn = document.getElementById("mode-btn");
const dfmodeBtn = document.getElementById("dfmode-btn"); //내가 추가.
const colorOptions = Array.from( //배열로 만들기
  document.getElementsByClassName("color-option")
);
const color = document.getElementById("color");
const lineWidth = document.getElementById("line-width");
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d"); //2d로 나타낸다?

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

ctx.lineWidth = lineWidth.value;
ctx.lineCap = "round"; //?
let isPainting = false; 
let isFilling = false;

//isPainting의 값에 따라 선그리기 함수
function onMove(event) {
  //isPainting이 true일때 마우스가 있는 위치에 선을 그린다.
  if (isPainting) {
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();
    return;
  }
  //isPainting이 false이면 움직이기만.
  ctx.moveTo(event.offsetX, event.offsetY);
}

//그리기 시작
function startPainting() {
  isPainting = true;
}

//그리기 취소
function cancelPainting() {
  isPainting = false;
  ctx.beginPath();
}

//선두께 변경
function onLineWidthChange(event) {
  ctx.lineWidth = event.target.value;
}

//
function onColorChange(event) {
  ctx.strokeStyle = event.target.value;
  ctx.fillStyle = event.target.value;
}

//
function onColorClick(event) {
  const colorValue = event.target.dataset.color;
  ctx.strokeStyle = colorValue;
  ctx.fillStyle = colorValue;
  color.value = colorValue;
}

//버튼 텍스트변경 그리기/채우기
function onModeClick() {
  if (isFilling) {
    isFilling = false;
    modeBtn.innerText = "Fill";
  } else {
    isFilling = true;
    modeBtn.innerText = "Draw";
  }
}

//전체 색 채우기
function onCanvasClick() {
  //isFilling이 true면 사각형을 전체 채운다.
  if (isFilling) {
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }
}

//전체 지우기
function onDestroyClick() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

//지우기
function onEraserClick() {
  ctx.strokeStyle = "white";
  isFilling = false; //
  modeBtn.innerText = "Fill";
}

//파일 삽입하기
function onFileChange(event) {
    //input에 있는 파일을 읽는다. 배열에서 첫번째 파일을 불러옴. 
    //파일배열인 이유는 input에 multiple속성(파일 여러개 업로드)을 추가할 수 있기 때문.
  const file = event.target.files[0];
  //createObjectURL메소드 호출. 해당 파일의 브라우저 메모리 URL을 알아낼 수 있음.
  //유저가 파일을 업로드한 브라우저 안에서만 사용할 수 있는 url.
  const url = URL.createObjectURL(file); 
  //이미지 파일 생성. document.createElement("img")와 동일
  const image = new Image();
  //이미지태그의 src 속성을 브라우저에서 불러온 url로 설정.
  image.src = url; 
  //이벤트리스너 추가하는 다른방법.
  image.onload = function () {
    //이미지가 로드되면 drawImage메소드 호출. 그려주는 메소드.
    ctx.drawImage(image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    fileInput.value = null;
  };
}

//더블클릭하여 텍스트 삽입하기
function onDoubleClick(event) {
    //입력한 텍스트는 value에 담긴다. 입력받은 텍스트 가져오기.
  const text = textInput.value;
  //텍스트가 빈값이 아니면~
  if (text !== "") {
    //이전 설정 저장한 후
    ctx.save();
    ctx.lineWidth = 1; //선두께는 1
    ctx.font = "68px sans-serif"; //폰트 사즈와, 폰트 설정
    //글자채우기() 마우스로 클릭한 곳에 표현
    ctx.fillText(text, event.offsetX, event.offsetY);
    //이전 설정으로 되돌아가기 (save와 restore을 세트로 사용하면 
    //restore이후 그 둘 사이에서 설정한 값들은 사라짐.)
    ctx.restore();
  }
}

//그림 다운로드 하기
function onSaveClick() {
    //canvas에서 toDataURL()메소드 불러 url변수에 저장
    //이 메소드는 캔버스에 있는 그림데이터를 URL로 변환해주는 메소드.
  const url = canvas.toDataURL();
  //링크 생성. 
  const a = document.createElement("a");
  //위에서 생성한 링크는 그림데이터 url로 가는 링크로 지정.
  a.href = url;
  //다운로드 속성설정. 다운로드 시 파일이름 설정.
  a.download = "myDrawing.png";
  a.click();
}

function onDfmodeClick() {
  if (isPainting) {
    ctx.fill();
  }
}

canvas.addEventListener("dblclick", onDoubleClick); //텍스트 삽입에 사용. (더블클릭이벤트, 실행할 함수명)
canvas.addEventListener("mousemove", onMove); //(마우스움직임이벤트, 실행할 함수명)
canvas.addEventListener("mousedown", startPainting); //(마우스아래로누름이벤트, 실행할 함수명)
canvas.addEventListener("mouseup", cancelPainting); //(마우스위로올라옴이벤트, 실행할 함수명)
canvas.addEventListener("mouseleave", cancelPainting); //(마우스가 화면밖으로나감이벤트, 실행할 함수명)
canvas.addEventListener("click", onCanvasClick); //(클릭이벤트, 실행할 함수명)
lineWidth.addEventListener("change", onLineWidthChange); //(변화이벤트, )
color.addEventListener("change", onColorChange); 
//잘모르는 부분.
colorOptions.forEach((color) => color.addEventListener("click", onColorClick)); //
modeBtn.addEventListener("click", onModeClick);
destroyBtn.addEventListener("click", onDestroyClick);
eraserBtn.addEventListener("click", onEraserClick);
//파일삽입 이벤트리스너. 파일에 변화 생기면 함수실행.
fileInput.addEventListener("change", onFileChange);
//이미지 다운로드 이벤트리스너.
saveBtn.addEventListener("click", onSaveClick);
dfmodeBtn.addEventListener("click", onDfmodeClick); //