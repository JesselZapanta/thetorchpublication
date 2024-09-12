<?php

namespace App\Utilities;

class TrieNode {
    public $children = [];
    public $isEndOfWord = false;
    public $failLink = null;
}

class AhoCorasick {
    private $root;

    public function __construct() {
        $this->root = new TrieNode();
    }

    private function normalize($word) {
        // Replace sequences of the same character with a single character
        return preg_replace('/(.)\\1+/', '$1', $word);
    }

    public function insert($word) {
        $normalizedWord = $this->normalize($word);
        $node = $this->root;
        foreach (str_split($normalizedWord) as $char) {
            if (!isset($node->children[$char])) {
                $node->children[$char] = new TrieNode();
            }
            $node = $node->children[$char];
        }
        $node->isEndOfWord = true;
    }

    public function buildFailureLinks() {
        $queue = new \SplQueue();
        $this->root->failLink = $this->root;
        foreach ($this->root->children as $char => $node) {
            $node->failLink = $this->root;
            $queue->enqueue($node);
        }

        while (!$queue->isEmpty()) {
            $currentNode = $queue->dequeue();
            foreach ($currentNode->children as $char => $childNode) {
                $queue->enqueue($childNode);
                $failNode = $currentNode->failLink;
                while ($failNode !== $this->root && !isset($failNode->children[$char])) {
                    $failNode = $failNode->failLink;
                }
                $childNode->failLink = isset($failNode->children[$char]) ? $failNode->children[$char] : $this->root;
                $childNode->isEndOfWord = $childNode->isEndOfWord || $childNode->failLink->isEndOfWord;
            }
        }
    }

    public function search($text) {
        $normalizedText = $this->normalize($text);
        $node = $this->root;
        $length = strlen($normalizedText);

        for ($i = 0; $i < $length; $i++) {
            $char = $normalizedText[$i];
            while ($node !== $this->root && !isset($node->children[$char])) {
                $node = $node->failLink;
            }
            $node = isset($node->children[$char]) ? $node->children[$char] : $this->root;
            if ($node->isEndOfWord) {
                return true; // Found a bad word
            }
        }
        return false;
    }
}
