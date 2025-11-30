<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Random\RandomException;
use Symfony\Component\Console\Attribute\AsCommand;

#[AsCommand(name: 'admin:user:create')]
class UserCreateCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'admin:user:create
        { name : The name of the user }
        { email : The email of the user }
        { --A|ask-for-password : Ask for the password, otherwise the command will generate a random one }
        { --F|verify-email : Verify the email address of the user }';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a new user';

    /**
     * The console command help text.
     *
     * @var string
     */
    protected $help = 'This command creates a new user.';

    /**
     * Execute the console command.
     *
     * @throws RandomException
     */
    public function handle(): int
    {
        $email = $this->argument('email');

        if (User::query()->where('email', $email)->exists()) {
            $this->error("User with email $email already exists.");
            return self::FAILURE;
        }

        $password = $this->getPassword();

        $user = [
            'name' => $this->argument('name'),
            'email' => $email,
            'password' => $password,
        ];

        if ($this->option('verify-email')) {
            $user['email_verified_at'] = Carbon::now()->toDateTimeString();
        }

        $user = User::create($user);

        $this->printUserDetails($user, $password);

        return self::SUCCESS;
    }

    /**
     * Get the password for the user.
     *
     * @return string
     *
     * @throws RandomException
     */
    private function getPassword(): string
    {
        if ($this->option('ask-for-password')) {
            return $this->secret('Enter the password');
        } else {
            return bin2hex(random_bytes(16));
        }
    }

    /**
     * Print the user details.
     */
    private function printUserDetails(User $user, string $password): void
    {
        $this->info("Created user '$user->name' ($user->email)");
        $this->line(" ID: {$user->getKey()}");
        $this->line(" Name: $user->name");
        $this->line(" Email: $user->email");

        if ($this->option('ask-for-password')) {
            $this->line(" Password: $password");
        }
    }
}
