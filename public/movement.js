document.addEventListener('keydown', (e) => {
    if (e.code === "ArrowUp")
    {
        socket.emit('movement', { direction: 'up' });
    }
    else if (e.code === "ArrowDown")
    {
        socket.emit('movement', { direction: 'down' });
    }
    else if (e.code === "ArrowLeft")
    {
        socket.emit('movement', { direction: 'left' });
    }
    else if (e.code === "ArrowRight")
    {
        socket.emit('movement', { direction: 'right' });
    }
  });