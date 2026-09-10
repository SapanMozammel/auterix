# Beacon architecture

This Python worker owns its retry policy in src/beacon/worker.py. Its packaging,
formatter and source layout are independent of the adopted workflow. The
documentation must describe the existing bounded policy without widening retries.
