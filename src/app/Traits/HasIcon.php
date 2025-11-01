<?php

declare(strict_types=1);

namespace App\Traits;

/**
 * @property string $icon
 */
trait HasIcon
{
    /**
     * Get the icon path for this model.
     *
     * @return string|null
     */
    public function getIcon(): string|null
    {
        if (! is_null($this->icon)) {
            return "svg/$this->icon.svg";
        }

        return null;
    }
}
