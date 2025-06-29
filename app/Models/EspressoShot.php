<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EspressoShot extends Model
{
    use HasFactory;

    protected $fillable = [
        'timestamp',
        'duration',
        'datapoints',
        'profile',
    ];

    protected $casts = [
        'timestamp' => 'integer',
        'duration' => 'integer',
        'datapoints' => 'array',
        'profile' => 'array',
    ];

    /**
     * Get the shot datapoints
     */
    public function getDatapointsAttribute($value)
    {
        return json_decode($value, true);
    }

    /**
     * Set the shot datapoints
     */
    public function setDatapointsAttribute($value)
    {
        $this->attributes['datapoints'] = json_encode($value);
    }

    /**
     * Get the profile data
     */
    public function getProfileAttribute($value)
    {
        return json_decode($value, true);
    }

    /**
     * Set the profile data
     */
    public function setProfileAttribute($value)
    {
        $this->attributes['profile'] = json_encode($value);
    }
}
