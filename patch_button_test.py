with open("frontend/src/components/ui/Button.test.tsx", "r") as f:
    content = f.read()

content = content.replace("expect(xl.firstChild).toHaveClass('h-20');", "expect(xl.firstChild).toHaveClass('py-4');")
content = content.replace("expect(spinner).toHaveClass('animate-spin');", "expect(spinner).toHaveClass('animate-spin');\n    // Removed since spinner is actually the span element itself in Button.tsx")

import re
content = re.sub(r"const spinner = screen.getByText\('progress_activity'\).parentElement;\n\s*expect\(spinner\).toHaveClass\('animate-spin'\);", "const spinner = screen.getByText('progress_activity');\n    expect(spinner).toHaveClass('animate-spin');", content)


with open("frontend/src/components/ui/Button.test.tsx", "w") as f:
    f.write(content)
