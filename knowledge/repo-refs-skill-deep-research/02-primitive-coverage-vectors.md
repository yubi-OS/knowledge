# 02 - Primitive Coverage Vectors for Documentation Corpora

Scope: why a documentation corpus should be scored as binary structural feature vectors, how those primitives are extracted from document structure, and how the resulting vectors are evaluated.

## Why binary features

Representing each document as a vector of 0/1 flags is a classification pattern with established precedent. An IEEE-published method treats classification directly on Boolean vectors, using logical dynamic systems designed for binary feature vectors and applied across science and industry domains (https://ieeexplore.ieee.org/document/9596697, jev weight 0.79, high). The practical question for a docs corpus is not whether binary representation works, but which features carry the information.

The dimensionality argument comes from feature-representation theory: linear classifiers are a very restricted class of hypotheses, and making complex distinctions in low dimensions is unhelpful (MIT 6.036 course notes, https://openlearninglibrary.mit.edu/assets/courseware/v1/b5ca509c17bab346cc6252ca41a1aac7/asset-v1:MITx+6.036+1T2019+type@asset+block/notes_chapter_Feature_representation.pdf, jev weight 0.79, high). For a corpus-scored design that means two things. First, features that are constant across the corpus (a flag present on every file) carry no discriminating information and should be dropped from the fit. Second, a small feature set only works if the kept features are genuinely load-bearing, which is why a near-constant filter precedes any downstream fit.

## Extracting structure from documents

The primitives are structural elements, and document parsing is the established field for extracting them. The survey literature defines document parsing (also called document content extraction) as the essential tool for converting unstructured and semi-structured documents into structured information, recognizing and extracting elements such as text, equations, tables, and images while preserving their structure (https://arxiv.org/html/2410.21169v1, jev weight 0.85, high). For markdown documentation archives the same principle applies with simpler element types: headings, metadata blocks, cross-reference markers, verification sections.

Tooling exists at every layer of that extraction. deepdoctection is a Python library that orchestrates document layout analysis, OCR, and document and token classification into extraction pipelines (https://github.com/deepdoctection/deepdoctection, jev weight 0.66, high). structx extracts structured data from text, tables, and documents using LLMs with semantic validation (https://github.com/Blacksuan19/structx, jev weight 0.72, high). A docs-archive skill does not need either library, but the design lesson transfers: extraction is a pipeline with per-element detectors, not a single parser call.

## Evaluation practice

The standard evaluation pattern for a feature-extraction pipeline is a tunable end-to-end benchmark. The scikit-learn example suite demonstrates exactly this: a text feature extraction and evaluation pipeline on a document classification dataset, with classifier hyperparameters tuned by randomized search (https://sklearn.org/stable/auto_examples/model_selection/plot_grid_search_text_feature_extraction.html, jev weight 0.93, high). A primitive-coverage scorer should be validated the same way, on a labeled subset of the corpus, before its vectors feed any downstream geometry.

## Weak-backed context, labeled as such

Several familiar NLP representations are related but weaker fits for this problem, and their low weights are informative rather than incidental. Doc2Vec extends Word2Vec to fixed-length document embeddings capturing semantic and contextual information (https://www.geeksforgeeks.org/nlp/doc2vec-in-nlp/, jev weight 0.16, weak). Latent semantic analysis relates documents and terms through distributional semantics (https://handwiki.org/wiki/Latent_semantic_analysis, jev weight 0.10, weak). A patent-style writeup of semantic document classification describes extracting structural, syntactical, and semantic information and feeding TF-IDF and machine-learning models (https://eureka.patsnap.com/triz-case/semantic-document-classification-vectors, jev weight 0.15, weak). These are dense semantic embeddings; a coverage vector is deliberately sparse and structural, and that contrast, not the techniques themselves, is the citable point.

## What the primitive set must capture

Synthesizing the extraction literature above, a per-file coverage vector for a documentation archive should be a set of presence flags, each with a concrete detection pattern: topic anchor (title and metadata), problem statement section, recommendation or verdict section, evidence markers (run identifiers, commit hashes, pass and fail verdicts), cross-references (issue keys, pull request numbers, sibling doc names), temporal anchor (dates in metadata or filename), verification plan section, source citations, and priority signal. Each flag is a 0/1 per file, the vector is the document's structural fingerprint, and the evaluation gate from the scikit-learn pattern (https://sklearn.org/stable/auto_examples/model_selection/plot_grid_search_text_feature_extraction.html, jev weight 0.93, high) applies before anything downstream trusts it.
