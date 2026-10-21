def choose_next_action(is_correct: bool, hint_count: int, consecutive_errors: int) -> str:
    """Simple, transparent MVP rule; not a validated educational assessment."""
    if not is_correct and consecutive_errors >= 2:
        return 'reteach'
    if not is_correct:
        return 'give_hint'
    if hint_count == 0:
        return 'reinforce_or_gently_increase_difficulty'
    return 'reinforce'
