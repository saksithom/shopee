<?php

namespace App\Services;

trait Userstamps
{
    use \Wildside\Userstamps\Userstamps {
        editor as updater;
    }
}
