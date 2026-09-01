from django.core.management.base import BaseCommand

from apps.jobs.models import Job


SEED_JOBS = [
    {
        'title': 'Senior UX Designer',
        'company_name': 'Stellar Tech Innovations',
        'location': 'San Francisco, CA • Remote',
        'work_mode': 'Remote',
        'pay_range': '$120k - $150k a year',
        'pay_full': '$120,000 - $150,000 a year',
        'job_type': 'Full-time',
        'description': 'We are looking for a Senior UX Designer to lead the design of our core product suite.',
        'full_description': 'We are looking for a highly skilled Senior UX Designer to join our dynamic product team.',
        'responsibilities': [
            'Lead end-to-end design processes from conceptualization to final deployment.',
            'Collaborate with product managers, engineers, and stakeholders to define user flows.',
            'Conduct user research, usability testing, and transform insights into actionable designs.',
        ],
        'logo_text': 'J',
        'logo_bg': 'bg-slate-100 text-indigo-600',
        'match_score': '98% Match',
        'posted_label': 'Posted 2 days ago',
    },
    {
        'title': 'Product Manager',
        'company_name': 'FinCorp Solutions',
        'location': 'New York, NY • Hybrid',
        'work_mode': 'Hybrid',
        'pay_range': '$140k - $170k a year',
        'pay_full': '$140,000 - $170,000 a year',
        'job_type': 'Full-time',
        'description': 'Join our rapidly growing fintech startup.',
        'full_description': 'FinCorp Solutions is seeking an ambitious Product Manager to drive product strategy.',
        'responsibilities': [
            'Define key product requirements and user stories.',
            'Work closely with cross-functional development teams.',
            'Track and analyze KPIs to optimize feature rollout.',
        ],
        'logo_text': 'F',
        'logo_bg': 'bg-emerald-100 text-emerald-700',
        'match_score': '85% Match',
        'posted_label': 'Posted 5 days ago',
    },
    {
        'title': 'Frontend Developer',
        'company_name': 'Creative Agency LLC',
        'location': 'Austin, TX • On-site',
        'work_mode': 'On-site',
        'pay_range': '$90k - $120k a year',
        'pay_full': '$90,000 - $120,000 a year',
        'job_type': 'Contract',
        'description': 'Looking for a React specialist to build interactive marketing sites.',
        'full_description': 'Creative Agency LLC is hiring a Frontend Developer experienced in modern Javascript frameworks.',
        'responsibilities': [
            'Build responsive, accessible UI components.',
            'Optimize app performance and SEO structure.',
            'Collaborate with visual designers to implement pixel-perfect layouts.',
        ],
        'logo_text': '</>',
        'logo_bg': 'bg-amber-100 text-amber-700',
        'match_score': None,
        'posted_label': 'Posted 1 week ago',
    },
]


class Command(BaseCommand):
    help = 'Seed sample jobs for Joblifyr'

    def handle(self, *args, **options):
        if Job.objects.exists():
            self.stdout.write(self.style.WARNING('Jobs already exist; skipping seed.'))
            return
        for item in SEED_JOBS:
            Job.objects.create(**item)
        self.stdout.write(self.style.SUCCESS(f'Seeded {len(SEED_JOBS)} jobs.'))
