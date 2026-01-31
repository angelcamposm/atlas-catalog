<?php

declare(strict_types=1);

namespace App\Enums;

enum JenkinsClasses: string
{
    case AllViews = 'org.jenkinsci.plugins.view.AllViews';
    case Folder = 'com.cloudbees.hudson.plugins.folder.Folder';
    case MultiBranch = 'org.jenkinsci.plugins.workflow.multibranch.WorkflowMultiBranchProject';
    case MyView = 'org.jenkinsci.plugins.view.MyView';
    case OrganizationFolder = 'jenkins.branch.OrganizationFolder';
    case WorkflowJob = 'org.jenkinsci.plugins.workflow.job.WorkflowJob';

    // Aliases
    case Pipeline = JenkinsClasses::WorkflowJob->value;
    case View = JenkinsClasses::MyView->value;

    /**
     * Return the folder classes
     *
     * @return array<self>
     */
    private static function folderCases(): array
    {
        return [
            self::Folder,
            self::MultiBranch,
            self::OrganizationFolder,
        ];
    }

    /**
     * Return the folder class values
     *
     * @return array<string>
     */
    public static function folderClassValues(): array
    {
        return array_map(
            static fn (self $case): string => $case->value,
            self::folderCases()
        );
    }
}
