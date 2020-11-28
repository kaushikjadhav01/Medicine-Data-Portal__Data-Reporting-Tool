from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework import mixins

from api.helpers.custom_permissions import IsAdmin
from api.models import (
    Product,ProductSerializer,
    Stage,StageSerializer,
    ActiveProduct,ActiveProductSerializer
)
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

class ProductViewSet(viewsets.GenericViewSet,
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin
):

    permission_classes = [IsAdmin]

    serializer_class = ProductSerializer
    queryset = Product.objects.all()
    @swagger_auto_schema(manual_parameters=[
        openapi.Parameter(
            'recent', openapi.IN_QUERY, 
            type=openapi.TYPE_BOOLEAN, 
            required=True
        )]
    )
    def list(self,request):
        if request.query_params['recent'] == 'true':
            products = Product.objects.filter(is_active=True).order_by('-updated_at')
        else:
            products = Product.objects.filter(is_active=True).order_by('product_name')
        
        if not products:
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            serializer = ProductSerializer(data=products,many=True)
            serializer.is_valid()
            return Response(serializer.data,status=status.HTTP_200_OK)

    def destroy(self,request,pk):

        product = Product.objects.get(pk=pk)
        product.is_active = False
        product.save()

        return Response(status=status.HTTP_204_NO_CONTENT)