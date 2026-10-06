# 01 - LLC and the Vacuum: what the title joins

Scope: the 2 halves of the LEARN.md title. What "LLC (Learned Latent Curves)" means as the doc uses it, what "The Vacuum" refers to, and where the wider literature overlaps.

## What the source doc says

The ground source is [yubi-OS/yubiOS docs/LEARN.md](https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/LEARN.md) (1372 bytes). Its full title is "LLC (Learned Latent Curves) and The Vacuum" (source doc). The doc contains no prose paragraphs at all: a title, an image header, a Charts section with 3 images, a mermaid diagram, and 2 drift check entries (source doc). The title is therefore the only place either term is named, and neither half gets an expansion anywhere in the file (source doc).

## LLC as the source doc uses it

The doc expands LLC once, in the title parenthetical: "LLC (Learned Latent Curves)" (source doc). Everything else the doc says about the concept is structural. The mermaid diagram names the moving parts: a 1D input t feeds a "Learner: Fourier features" block, which feeds a "Small MLP", which projects 2 curves, z_project(t) and z_self(t) (source doc). Under that reading, the "learned curves" of LLC are outputs of a learned model evaluated along the single parameter t (source doc, structural reading).

The wider literature offers weak but real anchors for both halves of the phrase. "Latent space" is standard terminology for an abstract, lower dimensional representation of data that captures its essential features ([GeeksforGeeks](https://www.geeksforgeeks.org/deep-learning/latent-space-in-deep-learning/), weight 0.10, weak; [Baeldung](https://www.baeldung.com/cs/dl-latent-space), weight 0.15, weak). Representation learning is the part of machine learning that learns features from raw inputs rather than taking them as given ([MIT 6.390 notes](https://introml.mit.edu/notes/representation.html), weight 0.20, weak). "Learning curve" in its classical sense is a graphical representation of the relationship between proficiency at a task and accumulated experience ([Wikipedia](https://en.wikipedia.org/wiki/Learning_curve), weight 0.20, weak).

The phrase "learned latent" also appears in applied 2026 work: an arXiv paper accelerates posterior inference from pulsar light curves by combining learned latent representations with simulator guided optimization ([arXiv 2602.14520](https://arxiv.org/abs/2602.14520), weight 0.13, weak; [PDF version](https://arxiv.org/pdf/2602.14520), weight 0.11, weak). The overlap is terminology only: that paper's curves are physical light curves, not learned evaluation curves. The source doc's curves are closer to the learning curve instrument of the supervised learning literature, which assesses the performance of a learning algorithm with respect to a resource ([Springer Machine Learning](https://link.springer.com/article/10.1007/s10994-024-06619-7), weight 0.19, weak).

Predictive learning supplies the strongest, still weak, external anchor: neural networks trained on predictive tasks generate representations that recover the underlying low dimensional latent structure in the data ([Nature Communications](https://www.nature.com/articles/s41467-021-21696-1), weight 0.31, weak; [PDF](https://www.nature.com/articles/s41467-021-21696-1.pdf), weight 0.28, weak). This is the mechanism the diagram assumes: the learner extracts a compact curve object from training, and everything downstream evaluates that object (source doc, structural reading).

## The Vacuum: an undefined term

"The Vacuum" appears exactly once, in the title (source doc). The doc gives it no diagram node, no chart, and no prose. No dig result in this corpus addresses a machine learning concept called "The Vacuum". This is recorded as a gap, not glossed: the corpus cannot say what The Vacuum refers to without inventing. Anyone expanding this corpus should resolve the term with the doc's maintainers before writing it up.

## What this doc contributes

A reader arriving at the doc cold should take away 3 things. First, LLC is an operating name for a learner that emits curves, and the doc's only definition of it is the diagram (source doc). Second, each half of the phrase maps to standard ML vocabulary, latent representation and learning curve, but the specific composition is the project's own (weak external backing, weights 0.10 to 0.31). Third, "The Vacuum" is an open term, and the honest state of knowledge about it is that the doc does not say.

## Gaps recorded in this doc

- "The Vacuum" is undefined in the source doc and unaddressed by the digs.
- The mapping from the title's LLC to the diagram's curves is a structural reading, not a definition the doc states.
- All external anchors for this subtopic weigh below 0.5, so no claim in the wider-literature sections above is more than weakly backed.
