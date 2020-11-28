import csv
from django.http import HttpResponse
from django.http import StreamingHttpResponse

class Echo:
    def write(self, value):
        return value

def iter_items(rows, pseudo_buffer, column_names):
    writer = csv.DictWriter(pseudo_buffer, fieldnames=column_names)
    yield writer.writeheader()

    for row in rows:
        try:
            yield writer.writerow(row)
        except ValueError:
            pass

def generate_csv(column_names=None,rows=None,filename=None):
    pseudo_buffer = Echo()
    
    writer = csv.DictWriter(pseudo_buffer,column_names)
    
    response = StreamingHttpResponse(
        streaming_content=(iter_items(rows, pseudo_buffer, column_names)),
        content_type="text/csv")
    response['Content-Disposition'] = 'attachment; filename=' + filename + ".csv"

    return response