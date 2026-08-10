from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Job

class JobListAPIView(APIView):
    def get(self, request):
        query = request.query_params.get('search', '')
        jobs = Job.objects.all()
        if query:
            jobs = jobs.filter(title__icontains=query) | jobs.filter(company_name__icontains=query)

        data = [
            {
                'id': j.id,
                'title': j.title,
                'company_name': j.company_name,
                'location': j.location,
                'work_mode': j.work_mode,
                'pay_range': j.pay_range,
                'job_type': j.job_type,
                'description': j.description,
                'created_at': j.created_at
            }
            for j in jobs
        ]
        return Response({'count': len(data), 'results': data})
