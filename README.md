HTML结构
让我们用网格中的数字来设置标记：

<div class="grid">
  <figure class="grid__item">
    <div class="grid__item-img" style="background-image: url(assets/1.webp)"></div>
    <figcaption class="grid__item-caption">Zorith - L91</figcaption>
  </figure>
  <!-- Repeat for more items -->
</div>
在网格内，我们有许多.grid__item人物，每个都有背景图像和标签。这些内容将根据JavaScript定义的列数动态分组为列。

CSS 网格设置
.grid {
  display: grid;
  grid-template-columns: repeat(var(--column-count), minmax(var(--column-size), 1fr));
  grid-column-gap: var(--c-gap);
  grid-row-gap: var(--r-gap);
}

.grid__column {
  display: flex;
  flex-direction: column;
  gap: var(--c-gap);
}
我们定义所有变量的根。

那么在我们的JavaScript中，我们将通过在物品组周围插入.grid__column包裹器来改变DOM结构，每个圈子一个包裹器，这样我们可以单独控制它们的运动。我们为什么要这么做？移动列比单个项目更轻松。

JavaScript + GSAP 滚动平滑器
让我们一步步梳理一下这个逻辑。

1. 启用平滑滚动和延迟效果
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const smoother = ScrollSmoother.create({
  smooth: 1, // Inertia intensity
  effects: true, // Enable per-element scroll lag
  normalizeScroll: true, // Fixes mobile inconsistencies
});
这会激活GSAP的平滑滚动层。旗帜让我们可以让元素动画有延迟，不需要滚动监听器。effects: true

2. 根据CSS将项目分组到列
const groupItemsByColumn = () => {
  const gridStyles = window.getComputedStyle(grid);
  const columnsRaw = gridStyles.getPropertyValue('grid-template-columns');

  const numColumns = columnsRaw.split(' ').filter(Boolean).length;

  const columns = Array.from({ length: numColumns }, () => []); // Initialize column arrays

  // Distribute grid items into column buckets
  grid.querySelectorAll('.grid__item').forEach((item, index) => {
    columns[index % numColumns].push(item);
  });

  return { columns, numColumns };
};
这种方法将网格项目分组成数组，每个视觉列对应一个数组，使用CSS计算的实际列数。

3. 创建列包裹器并分配延迟
const buildGrid = (columns, numColumns) => {

  const fragment = document.createDocumentFragment(); // Efficient DOM batch insertion
  const mid = (numColumns - 1) / 2; // Center index (can be fractional)
  const columnContainers = [];

  // Loop over each column
  columns.forEach((column, i) => {
    const distance = Math.abs(i - mid); // Distance from center column
    const lag = baseLag + distance * lagScale; // Lag based on distance from center

    const columnContainer = document.createElement('div'); // New column wrapper
    columnContainer.className = 'grid__column';

    // Append items to column container
    column.forEach((item) => columnContainer.appendChild(item));

    fragment.appendChild(columnContainer); // Add to fragment
    columnContainers.push({ element: columnContainer, lag }); // Save for lag effect setup
  });

  grid.appendChild(fragment); // Add all columns to DOM at once
  return columnContainers;
};
列距离中心越远，延迟值越大，产生滚动时的“追赶”感。

4. 对每列施加延迟效应
const applyLagEffects = (columnContainers) => {
  columnContainers.forEach(({ element, lag }) => {
    smoother.effects(element, { speed: 1, lag }); // Apply individual lag per column
  });
};
ScrollSmoother 负责处理所有繁重的工作，我们只需通过所需的延迟。

5. 调整尺寸时的手柄布局
// Rebuild the layout only if the number of columns has changed on window resize
window.addEventListener('resize', () => {
  const newColumnCount = getColumnCount();
  if (newColumnCount !== currentColumnCount) {
    init();
  }
});
这确保了我们的布局在断点和列数变化（通过CSS处理）时保持正确。

就这些！
