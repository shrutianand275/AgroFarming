from flask import request

from utils.auth import get_current_user_id
from models.history_model import create_history


def save_history_if_logged_in(
    history_type,
    title,
    input_data,
    result
):
    try:
        user_id = get_current_user_id()

        # Guest user → don't save anything
        if not user_id:
            return False

        create_history(
            user_id=user_id,
            history_type=history_type,
            title=title,
            input_data=input_data,
            result=result
        )

        return True

    except Exception as e:
        # History failure must NEVER break the main farming feature
        print("HISTORY SAVE ERROR:", repr(e))
        return False