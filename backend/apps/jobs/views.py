from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Job


class JobListAPIView(APIView):
    def get(self, request):
        query = request.query_params.get('search', '').strip()
        location = request.query_params.get('location', '').strip()
        jobs = Job.objects.all().order_by('-created_at')

        if query:
            jobs = jobs.filter(title__icontains=query) | jobs.filter(company_name__icontains=query)
        if location:
            jobs = jobs.filter(location__icontains=location)

        data = [
            {
                'id': j.id,
                'title': j.title,
                'company_name': j.company_name,
                'location': j.location,
                'work_mode': j.work_mode,
                'pay_range': j.pay_range,
                'pay_full': j.pay_full or j.pay_range,
                'job_type': j.job_type,
                'description': j.description,
                'full_description': j.full_description or j.description,
                'responsibilities': j.responsibilities,
                'logo_text': j.logo_text,
                'logo_bg': j.logo_bg,
                'match_score': j.match_score,
                'posted_label': j.posted_label,
                'created_at': j.created_at,
            }
            for j in jobs
        ]
        return Response({'count': len(data), 'results': data}, status=status.HTTP_200_OK)
