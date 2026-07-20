Set-Location 'C:\Users\moizjmj\Crystal Web Solution'
Remove-Item _codex_inspect.ps1, _codex_inspect2.ps1, _codex_inspect3.ps1, _codex_inspect4.ps1, _codex_merge_test.ps1, _codex_check_local_mods.ps1, _codex_build_test.ps1, _codex_push_pr.ps1 -ErrorAction SilentlyContinue
git checkout main
git status --short --branch
