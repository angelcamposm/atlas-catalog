<?php

declare(strict_types=1);

namespace Tests\Unit\Enums;

use App\Enums\WorkflowRunResult;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(WorkflowRunResult::class)]
class WorkflowRunResultTest extends TestCase
{
    #[Test]
    #[DataProvider('workflow_run_result')]
    public function it_has_correct_values(WorkflowRunResult $workflowRunResult, string $expectedValue): void
    {
        $this->assertSame($expectedValue, $workflowRunResult->value);
    }

    #[Test]
    public function it_can_be_instantiated(): void
    {
        $this->assertInstanceOf(WorkflowRunResult::class, WorkflowRunResult::Success);
    }

    #[Test]
    public function it_returns_all_cases(): void
    {
        $this->assertIsArray(WorkflowRunResult::cases());
        $this->assertNotEmpty(WorkflowRunResult::cases());
        $this->assertCount(5, WorkflowRunResult::cases());
    }

    public static function workflow_run_result(): array
    {
        return [
            'Aborted' => [WorkflowRunResult::Aborted, 'ABORTED'],
            'Failure' => [WorkflowRunResult::Failure, 'FAILURE'],
            'NotBuilt' => [WorkflowRunResult::NotBuilt, 'NOT_BUILT'],
            'Success' => [WorkflowRunResult::Success, 'SUCCESS'],
            'Unstable' => [WorkflowRunResult::Unstable, 'UNSTABLE'],
        ];
    }
}
