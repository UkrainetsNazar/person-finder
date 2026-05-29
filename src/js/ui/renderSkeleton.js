const skeletonCardHTML = () => `
  <div class="skeleton-card" aria-hidden="true">
    <div class="skeleton-header">
      <div class="sk sk--circle"></div>
      <div class="skeleton-header__info">
        <div class="sk sk--line" style="width: 60%"></div>
        <div class="sk sk--line-sm" style="width: 38%"></div>
      </div>
    </div>
    <div class="sk sk--divider"></div>
    <div style="display: flex; flex-direction: column; gap: 10px">
      <div class="sk sk--line" style="width: 82%"></div>
      <div class="sk sk--line" style="width: 68%"></div>
      <div class="sk sk--line" style="width: 54%"></div>
    </div>
  </div>`;

export const renderSkeleton = (container, count) => {
  const grid = document.createElement('div');
  grid.className = 'skeleton-grid';
  grid.innerHTML = Array.from({ length: count }, skeletonCardHTML).join('');
  container.innerHTML = '';
  container.appendChild(grid);
};
