<?php

namespace App\Broadcasting;

use App\Models\User;

class order
{
    public $user;
    /**
     * Create a new channel instance.
     */
    public function __construct(User $user)
    {
        $this->user = $user;
    }

    /**
     * Authenticate the user's access to the channel.
     */
    public function join(User $user): array|bool
    {
        return true;
    }
}
