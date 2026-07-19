from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from typing import Optional
from app.core.websockets import manager
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/ws", tags=["WebSockets"])


@router.websocket("/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    """
    Establish a WebSocket connection for real-time updates.
    In a true production setting, user_id would be extracted from an auth token
    passed via query params or headers, but for this MVP we accept it in the path.
    """
    await manager.connect(websocket, user_id)
    try:
        while True:
            # We keep the connection open. The client doesn't need to send anything,
            # but we wait for incoming messages to detect disconnects.
            data = await websocket.receive_text()
            # Can handle incoming messages from frontend here if needed
            logger.debug(f"Received WS message from {user_id}: {data}")
    except WebSocketDisconnect:
        manager.disconnect(user_id)
