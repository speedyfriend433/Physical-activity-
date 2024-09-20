// script.js

// 모듈 추출
const { Engine, Render, Runner, World, Bodies, Body, Events, Mouse, MouseConstraint } = Matter;

// 엔진 생성
const engine = Engine.create();
const { world } = engine;

// 렌더러 설정
const canvas = document.getElementById('world');
const width = window.innerWidth;
const height = window.innerHeight - 100; // 헤더와 컨트롤을 위한 공간

canvas.width = width;
canvas.height = height;

const render = Render.create({
    canvas: canvas,
    engine: engine,
    options: {
        width: width,
        height: height,
        wireframes: false,
        background: '#fafafa'
    }
});

Render.run(render);

// 러너 설정
const runner = Runner.create();
Runner.run(runner, engine);

// 경계 설정 (바닥, 벽 등)
const boundaries = [
    // 바닥
    Bodies.rectangle(width / 2, height + 25, width, 50, { isStatic: true }),
    // 왼쪽 벽
    Bodies.rectangle(-25, height / 2, 50, height, { isStatic: true }),
    // 오른쪽 벽
    Bodies.rectangle(width + 25, height / 2, 50, height, { isStatic: true }),
    // 천장
    Bodies.rectangle(width / 2, -25, width, 50, { isStatic: true })
];
World.add(world, boundaries);

// 마우스 제어 추가
const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        stiffness: 0.2,
        render: {
            visible: false
        }
    }
});
World.add(world, mouseConstraint);

// 렌더러에 마우스 적용
render.mouse = mouse;

// 창 크기 조절 시 캔버스 크기 업데이트
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight - 100;
    render.bounds.max.x = width;
    render.bounds.max.y = height;
    render.options.width = width;
    render.options.height = height;
    canvas.width = width;
    canvas.height = height;

    // 경계 업데이트
    World.remove(world, boundaries);
    boundaries.length = 0;
    boundaries.push(
        Bodies.rectangle(width / 2, height + 25, width, 50, { isStatic: true }),
        Bodies.rectangle(-25, height / 2, 50, height, { isStatic: true }),
        Bodies.rectangle(width + 25, height / 2, 50, height, { isStatic: true }),
        Bodies.rectangle(width / 2, -25, width, 50, { isStatic: true })
    );
    World.add(world, boundaries);
});

// 객체 추가 함수
function addRectangle() {
    const widthRect = Math.random() * 80 + 20;
    const heightRect = Math.random() * 80 + 20;
    const rect = Bodies.rectangle(Math.random() * (width - 100) + 50, Math.random() * 100 + 50, widthRect, heightRect, {
        restitution: 0.8,
        friction: 0.5,
        render: {
            fillStyle: getRandomColor()
        }
    });
    World.add(world, rect);
}

function addCircle() {
    const radius = Math.random() * 40 + 10;
    const circle = Bodies.circle(Math.random() * (width - 100) + 50, Math.random() * 100 + 50, radius, {
        restitution: 0.8,
        friction: 0.5,
        render: {
            fillStyle: getRandomColor()
        }
    });
    World.add(world, circle);
}

function clearWorld() {
    World.clear(world, false);
    World.add(world, boundaries);
    World.add(world, mouseConstraint);
}

function getRandomColor() {
    const colors = ['#f94144', '#f3722c', '#f8961e', '#f9c74f', '#90be6d', '#43aa8b', '#4d908e', '#577590'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// 버튼 이벤트 리스너
document.getElementById('addRectangle').addEventListener('click', addRectangle);
document.getElementById('addCircle').addEventListener('click', addCircle);
document.getElementById('clear').addEventListener('click', clearWorld);

// 초기 객체 추가 (옵션)
for (let i = 0; i < 5; i++) {
    addRectangle();
    addCircle();
}
