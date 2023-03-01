from airflow.decorators import dag, task
from airflow.models import Variable
from pendulum import datetime
from fivetran_provider_async.operators import FivetranOperatorAsync
from airflow.providers.github.sensors.github import GithubTagSensor
import logging

# get the airflow.task logger
task_logger = logging.getLogger("airflow.task")


FIVETRAN_CONNECTOR_ID = "<your Fivetran connector ID>"
GITHUB_REPOSITORY = "<your GitHub handle>/airflow-fivetran-tutorial"
TAG_NAME = "sync-metadata"


@dag(start_date=datetime(2023, 1, 1), schedule="@daily", catchup=False)
def my_fivetran_dag():
    @task
    def generate_tag_to_await():
        """
        Retrieves the current number associated with the TAG_NAME Airflow
        Variable. If the Variable is not set, sets the number to 1 and creates
        the Variable.
        """

        try:
            number = Variable.get(f"{TAG_NAME}")
        except KeyError as err:
            task_logger.info(f"{err}" + " setting expected release number to 1.")
            number = 1
            Variable.set(f"{TAG_NAME}", number)

        return f"{TAG_NAME}/{number}"

    wait_for_tag = GithubTagSensor(
        task_id="wait_for_file",
        github_conn_id="github_conn",
        repository_name=GITHUB_REPOSITORY,
        tag_name="{{ ti.xcom_pull(task_ids='generate_tag_to_await', key='return_value') }}",
    )

    kick_off_fivetran_sync = FivetranOperatorAsync(
        task_id="kick_off_fivetran_sync",
        fivetran_conn_id="fivetran_conn",
        connector_id=FIVETRAN_CONNECTOR_ID,
    )

    @task
    def increase_tag_var():
        """
        Increases the number associated with the Airflow Variable TAG_NAME by 1.
        """

        old_num = Variable.get(f"{TAG_NAME}")
        new_num = int(old_num) + 1
        Variable.set(f"{TAG_NAME}", new_num)
        task_logger.info(f"Set Variable '{TAG_NAME}' to {new_num}")
        return new_num

    (
        generate_tag_to_await()
        >> wait_for_tag
        >> kick_off_fivetran_sync
        >> increase_tag_var()
    )


my_fivetran_dag()
