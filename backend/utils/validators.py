import re
from fastapi import HTTPException

K8S_NAME_REGEX = r'^[a-z0-9]([-a-z0-9]*[a-z0-9])?$'

def validate_k8s_name(name: str):
    if len(name) > 63:
        raise HTTPException(
            status_code=400,
            detail="Name must be less than 63 characters."
        )

    if not re.match(K8S_NAME_REGEX, name):
        raise HTTPException(
            status_code=400,
            detail="Invalid name format. Must follow Kubernetes naming rules."
        )

    return name


def validate_image(image: str):
    image_regex = r'^[\w\-\.]+\/[\w\-\.]+(:[\w\-\.]+)?$'

    if not re.match(image_regex, image):
        raise HTTPException(
            status_code=400,
            detail="Invalid Docker image format. Example: username/app:tag"
        )

    return image
