export default (cb: () => HTMLElement | undefined | null) => {
  const panning = ref(false);
  let startX = 0;
  let startY = 0;
  let startLeft = 0;
  let startTop = 0;

  //处理鼠标按下
  const handleMousedown = (e: MouseEvent) => {
    const containerRef = cb();

    if (!containerRef) {
      return;
    }

    panning.value = true;
    startX = e.clientX;
    startY = e.clientY;
    startLeft = containerRef.scrollLeft;
    startTop = containerRef.scrollTop;

    //鼠标移动
    containerRef.addEventListener('mousemove', handleMousemove);

    //鼠标抬起结束
    window.addEventListener('mouseup', handleMouseup);
  };

  //处理鼠标松开
  const handleMouseup = () => {
    const containerRef = cb();

    if (!containerRef) {
      return;
    }

    panning.value = false;

    //移除鼠标移动
    containerRef.removeEventListener('mousemove', handleMousemove);

    //移除抬起
    window.removeEventListener('mouseup', handleMouseup);
  };

  //处理鼠标移动
  const handleMousemove = (e: MouseEvent) => {
    const containerRef = cb();

    if (!containerRef || !panning.value) {
      return;
    }

    containerRef.scrollLeft = startLeft - (e.clientX - startX);
    containerRef.scrollTop = startTop - (e.clientY - startY);
  };

  return { panning, handleMousedown, handleMousemove };
};
